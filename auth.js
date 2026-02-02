import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "./database/mongoClientPromise";
import { userModel } from "./models/user-model";
import bcrypt from "bcryptjs";
import { dbConnect } from "./services/mongo";
import { replaceMongoIdInObject } from "@/utils/data-util";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./lib/token";

await dbConnect();

export const { handlers: { GET, POST }, auth } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise, { databaseName: process.env.ENVIRONMENT }),
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await userModel.findOne({ email: credentials.email });
        if (!user || !user.password) throw new Error("Invalid credentials");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid credentials");

        if (user.isOAuth) { 
          user.isOAuth = false;
          await user.save();
        }

        return replaceMongoIdInObject(user.toObject());
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: { signIn: "/login", error: "/login" },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const existingUser = await userModel.findOne({ email: profile.email });

        if (existingUser) {
          // Link Google account
          const client = await mongoClientPromise;
          const db = client.db(process.env.ENVIRONMENT);
          await db.collection("accounts").updateOne(
            { provider: "google", providerAccountId: profile.sub },
            { $set: { userId: existingUser._id, access_token: account.access_token || null } },
            { upsert: true }
          );

          await userModel.updateOne({ _id: existingUser._id }, { $set: { isOAuth: true, name: profile.name, image: profile.picture } });
          user = replaceMongoIdInObject(existingUser);
          user.name = profile.name;
          user.image = profile.picture;
        } else {
          user.id = user.id || user._id?.toString();
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        const userId = user._id?.toString() || user.id;

        const accessToken = generateAccessToken({ userId, role: user.role });
        const refreshToken = account.type === "credentials" ? generateRefreshToken({ userId }) : account.refresh_token || null;

        if (refreshToken) await userModel.updateOne({ _id: user._id }, { $set: { refreshToken } });

        return { ...token, user, accessToken, refreshToken, accessTokenExpires: Date.now() + 30 * 60 * 1000 };
      }

      if (Date.now() < (token.accessTokenExpires || 0)) return token;

      try {
        const payload = verifyRefreshToken(token.refreshToken);
        token.accessToken = generateAccessToken({ userId: payload.userId });
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000;
      } catch {
        token.error = "RefreshTokenExpired";
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },

  experimental: { allowDangerousEmailAccountLinking: true },
});
