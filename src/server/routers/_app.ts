import { z } from "zod"
import { procedure, router } from "../trpc"
import UsersService from "../../services/users"

export const appRouter = router({
  register: procedure
    .input(
      z.object({
        email: z.string().email().min(1),
        username: z.string().min(1),
        password: z.string()
          .min(8)
          .regex(/[a-z]/)
          .regex(/[A-Z]/)
          .regex(/[0-9]/)
          .regex(/[^a-zA-Z0-9]/)
          .optional(),
        token: z.string().optional()
      })
    )
    .mutation(async ({ input: { email, username, password, token }, ctx }) => {
      await UsersService.register(ctx.prisma, { email, username, password, token })

      return {}
    }),
  resend: procedure
    .input(z.string().email().min(1))
    .mutation(async ({ input: email, ctx }) => {
      await UsersService.resendVerificationEmail(email)

      return {}
    }
  )
})

export type AppRouter = typeof appRouter
