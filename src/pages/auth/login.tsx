import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import Link from "next/link"
import Form from "../../components/Form"
import Input from "../../components/Input"
import { useEffect } from "react"
import { signIn } from "next-auth/react"
import { FaGoogle, FaGithub } from "react-icons/fa"

const schema = z.object({
  email: z.string().min(1, "Este campo é obrigatório"),
  password: z.string().min(1, "Este campo é obrigatório")
})

type IFormInputs = z.infer<typeof schema>

export default function App() {
  const router = useRouter()

  useEffect(() => {
    if (router.query.email) {
      toast.success("Conta confirmada com sucesso! Faça login para continuar")
    } else if (router.query.verificarionError) {
      toast.error("Link de confirmação inválido")
    }
  }, [router.query])

  const onSubmit = async (data: IFormInputs) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/"
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form<IFormInputs> onDone={onSubmit} resolver={zodResolver(schema)} defaultValues={{ email: router.query.email as string }} mode="onBlur">
        <h1 className="text-center font-bold text-3xl mb-5">Entrar</h1>

        <button type="button" onClick={() => signIn("google")} className="p-2 bg-red-600 rounded-lg text-white font-medium flex items-center justify-center">
          <FaGoogle className="inline-block mr-2" />
          Entrar com o Google
        </button>
        <button type="button" onClick={() => signIn("github")} className="p-2 bg-gray-600 rounded-lg text-white font-medium flex items-center justify-center">
          <FaGithub className="inline-block mr-2" />
          Entrar com o Github
        </button>

        <div className="mt-5 mb-3 flex items-center justify-center">
          <div className="w-1/2 h-0.5 bg-gray-300"></div>
          <span className="mx-3 text-gray-500">ou</span>
          <div className="w-1/2 h-0.5 bg-gray-300"></div>
        </div>

        <Input name="email" label="E-mail ou nome de usuário" type="text" />
        <Input name="password" type="password" label="Senha" />

        <button type="submit" className="p-2 bg-blue-600 rounded-lg text-white font-medium mt-7">Entrar</button>

        <span className="mt-5 text-center">Não tem uma conta? <Link href="/auth/signup" className="text-blue-600 font-medium no-underline">Cadastre-se</Link></span>
        <span className="text-center">Esqueceu sua senha? <Link href="/auth/login" className="text-blue-600 font-medium no-underline">Recuperar</Link></span>
      </Form>
    </div>
  )
}
