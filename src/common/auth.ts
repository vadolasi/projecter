import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "../lib/prisma"
import { AuthService } from "../services/auth"
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" }
      },
      authorize: async (credentials) => {
        const { email, password, token } = credentials!

        return await AuthService.login(prisma, { email, password, token })
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }

      return token
    },
    session: async ({ session, token }) => {
      session.id = token.id as number

      return session
    },
    signIn: async ({ account, profile }) => {
      if (account!.provider === "google" || account!.provider === "github") {
        const { email } = profile!

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY!)

        return `/auth/signup/social?email=${email}&token=${token}`
      }

      return true
    }
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup"
  }
}
