import { PrismaClient } from "@prisma/client"
import { verify } from "argon2"
import jwt from "jsonwebtoken"

interface LoginInput {
  email: string
  password?: string
  token?: string
}

export class AuthService {
  static async login(prisma: PrismaClient, { email, password, token }: LoginInput) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: email }] }
    })

    if (!user) {
      return null
    }

    if (token) {
      const { email: verifiedEmail } = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string }

      if (verifiedEmail !== email) {
        return null
      }
    } else {
      const passwordValid = await verify(user.password!, password!)

      if (!passwordValid) {
        return null
      }
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username
    }
  }
}
