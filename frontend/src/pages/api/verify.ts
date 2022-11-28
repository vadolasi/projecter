import { NextApiHandler } from "next"
import prisma from "../../lib/prisma"
import UsersService from "../../services/users"

const handler: NextApiHandler = async (req, res) => {
  const token = req.query.token

  let email: string

  try {
    email = await UsersService.verify(prisma, token as string)
  } catch (error) {
    return res.redirect("/login?verificationError=true")
  }

  res.redirect(`/login?email=${email}`)
}

export default handler
