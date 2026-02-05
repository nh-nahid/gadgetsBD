import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "./database/mongoClientPromise";
import bcrypt from "bcryptjs";
import { userModel } from "./models/user-model";
import { replaceMongoIdInObject } from "@/utils/data-util";
import { generateAccessToken } from "./lib/token";

export const { handlers: { GET, POST }, auth } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise),

  session: { strategy: "jwt" },

  providers: [
    // ================= Credentials =================
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await userModel.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return replaceMongoIdInObject(user.toObject());
      },
    }),

    // ================= Google OAuth =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // ================= SignIn Callback =================
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const dbClient = await mongoClientPromise;
        const db = dbClient.db();

        // Check if user exists
        let existingUser = await userModel.findOne({ email: profile.email });

        if (!existingUser) {
          // Create new user
          existingUser = await userModel.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role: "USER",
            mobile: null,
            shopName: null,
            addresses: [],
            isOAuth: true,
            emailVerified: profile.email_verified ? new Date() : null,
          });
        }

        // Explicitly link Google account in "accounts" collection
        await db.collection("accounts").updateOne(
          { userId: existingUser._id.toString(), provider: "google" },
          {
            $set: {
              provider: "google",
              type: "oauth",
              providerAccountId: profile.sub,
              access_token: account.access_token,
              token_type: "Bearer",
              scope: account.scope,
            },
          },
          { upsert: true }
        );

        // Mutate the NextAuth user object
        user.id = existingUser._id.toString();
        user.name = existingUser.name;
        user.email = existingUser.email;
        user.image = existingUser.image;
      }

      return true;
    },

    // ================= JWT Callback =================
    async jwt({ token, user, account }) {
      if (user) {
        const userId = user._id?.toString() || user.id;

        token.user = user;
        token.accessToken = generateAccessToken({ userId });
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000;

        // Attach shop immediately for session
        try {
          const { getShopByOwnerId } = await import("@/database/queries");
          const shop = await getShopByOwnerId(userId);
          token.shop = shop || null;
        } catch (err) {
          console.error("Failed to fetch shop for session:", err);
          token.shop = null;
        }
      }

      return token;
    },

    // ================= Session Callback =================
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.shop = token.shop || null;
      return session;
    },
  },

  // Allow linking credentials + OAuth accounts
  experimental: { allowDangerousEmailAccountLinking: true },
});
