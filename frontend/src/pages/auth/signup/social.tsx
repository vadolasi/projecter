import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { NextPage } from "next"
import { trpc } from "../../../utils/trpc"
import Input from "../../../components/Input"
import Form from "../../../components/Form"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"

const schema = z.object({
  username: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
    .regex(/^[a-zA-Z0-9_-]+$/, "O nome de usuário só pode conter letras, números, hífens e sublinhados")
})
type IFormInputs = z.infer<typeof schema>

const RegisterPage: NextPage = () => {
  const { mutateAsync, isLoading } = trpc.register.useMutation()
  const router = useRouter()

  const { email, token } = router.query as { email: string; token: string }

  const onSubmit = async (data: IFormInputs) => {
    await mutateAsync({ email, token, ...data })

    await signIn("credentials", {
      email,
      token,
      callbackUrl: "/"
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form<IFormInputs> onDone={onSubmit} resolver={zodResolver(schema)} mode="onBlur">
        <h2 className="text-center font-bold text-lg mb-10">Para prosseguir, foneça os dados abaixo:</h2>

        <Input name="username" label="Nome de usuário" type="text" isLoading={isLoading} />

        <button type="submit" className={`p-2 bg-blue-600 rounded-lg text-white font-medium mt-7 ${isLoading ? "opacity-50" : ""}`} disabled={isLoading}>Continuar</button>
      </Form>
    </div>
  )
}

export default RegisterPage
