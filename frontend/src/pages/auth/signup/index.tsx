import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { NextPage } from "next"
import Link from "next/link"
import { trpc } from "../../../utils/trpc"
import Input from "../../../components/Input"
import Form from "../../../components/Form"
import { useRouter } from "next/router"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { signIn } from "next-auth/react"

const schema = z.object({
  email: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
    .email("Email inválido"),
  username: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
    .regex(/^[a-zA-Z0-9_-]+$/, "O nome de usuário só pode conter letras, números, hífens e sublinhados"),
  password: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
    .min(8, "A senha deve conter no mínimo 8 caracteres")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  passwordConfirmation: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      code: "invalid_string",
      message : "As senhas não conferem",
      path: ["passwordConfirmation"],
      validation: "email"
    })
  }
})

type IFormInputs = z.infer<typeof schema>

const RegisterPage: NextPage = () => {
  const { mutateAsync, isLoading } = trpc.register.useMutation()
  const router = useRouter()

  const onSubmit = async (data: IFormInputs) => {
    await mutateAsync(data)

    router.push(`/sent?email=${data.email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form<IFormInputs> onDone={onSubmit} resolver={zodResolver(schema)} mode="onBlur">
        <h1 className="text-center font-bold text-3xl mb-10">Cadastro</h1>

        <button type="button" onClick={() => signIn("google")} className="p-2 bg-red-600 rounded-lg text-white font-medium flex items-center justify-center">
          <FaGoogle className="inline-block mr-2" />
          Continuar com o Google
        </button>
        <button type="button" onClick={() => signIn("github")} className="p-2 bg-gray-600 rounded-lg text-white font-medium flex items-center justify-center">
          <FaGithub className="inline-block mr-2" />
          Continuar com o Github
        </button>

        <div className="mt-5 mb-3 flex items-center justify-center">
          <div className="w-1/2 h-0.5 bg-gray-300"></div>
          <span className="mx-3 text-gray-500">ou</span>
          <div className="w-1/2 h-0.5 bg-gray-300"></div>
        </div>

        <Input name="email" label="E-mail" type="email" isLoading={isLoading} />
        <Input name="username" type="text" label="Nome de usuário" isLoading={isLoading} />
        <Input name="password" label="Senha" type="password" isLoading={isLoading} />
        <Input name="passwordConfirmation" label="Confirmação de senha" type="password" isLoading={isLoading} />

        <button type="submit" className={`p-2 bg-blue-600 rounded-lg text-white font-medium mt-7 ${isLoading ? "opacity-50" : ""}`} disabled={isLoading}>Cadastrar</button>

        <span className="mt-5 text-center">Já tem uma conta? <Link href="/auth/login" className="text-blue-600 font-medium no-underline">Entrar</Link></span>
      </Form>
    </div>
  )
}

export default RegisterPage
