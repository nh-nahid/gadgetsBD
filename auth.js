import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "./database/mongoClientPromise";
import bcrypt from "bcryptjs";
import { userModel } from "./models/user-model";
import { replaceMongoIdInObject } from "@/utils/data-util";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./lib/token";

export const { handlers: { GET, POST }, auth } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise),
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await userModel.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return replaceMongoIdInObject(user.toObject());
      },
    }),

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
    async signIn({ account }) {
      // ✅ let NextAuth handle Google users
      return true;
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        const userId = user.id;

        token.user = user;
        token.accessToken = generateAccessToken({ userId });
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
