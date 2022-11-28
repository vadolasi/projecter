import { hash } from "argon2"
import { sendEmail } from "../utils/sendEmail"
import jwt from "jsonwebtoken"
import { getBaseUrl } from "../utils/getBaseUrl"
import type { PrismaClient } from "@prisma/client"

type CreateUserInput = {
  email: string
  username: string
  password?: string
  token?: string
}

export default class UsersService {
  static async register(prisma: PrismaClient, { email, username, password, token }: CreateUserInput) {
    if (token) {
      const { email: verifiquedEmail } = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string }

      if (verifiquedEmail !== email) {
        throw new Error("Invalid token")
      }

      await prisma.user.create({
        data: {
          email,
          username,
          emailVerified: true
        }
      })
    } else {
      await prisma.user.create({
        data: {
          email,
          username,
          password: password ? await hash(password) : undefined
        }
      })

      const authToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY!)

      await sendEmail("vitor036daniel@gmail.com", email, "verifyEmail", {
        url: `${getBaseUrl()}/api/verify?token=${authToken}`
      })
    }
  }

  static async resendVerificationEmail(email: string) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY!)

    await sendEmail("vitor036daniel@gmail.com", email, "verifyEmail", {
      url: `${getBaseUrl()}/api/verify?token=${token}`
    })
  }

  static async verify(prisma: PrismaClient, token: string) {
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    })

    return email
  }
}
