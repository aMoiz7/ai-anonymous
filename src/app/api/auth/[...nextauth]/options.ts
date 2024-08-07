import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbconnect();
        try {
           //@ts-ignore
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify first");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      
      if (token) {
        //@ts-ignore
        session.user._id = token._id;
        //@ts-ignore
        session.user.isVerified = token.isVerified;
        //@ts-ignore
        session.user.isAcceptMessage = token.isAcceptMessage;
        //@ts-ignore
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    }
  },
  pages: {
    signIn: '/sign-in'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
