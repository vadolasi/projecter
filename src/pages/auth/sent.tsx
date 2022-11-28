import { NextPage } from "next"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { trpc } from "../../utils/trpc"

const EmailSentPage: NextPage = () => {
  const { query: { email } } = useRouter()
  const { mutateAsync } = trpc.resend.useMutation()

  const resend = async () => {
    toast.promise(
      mutateAsync(email as string),
      {
        loading: "Enviando...",
        success: "Email reenviado com sucesso!",
        error: "Erro ao reenviar email"
      }
    )
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-lg font-medium">Foi enviado um email de confirmação para {email}</h1>
      <span className="text-sm text-gray-500">Verifique sua caixa de entrada e confirme sua conta. Se não encontrar o email, verifique sua caixa de spam, ou <button onClick={resend} className="text-blue-600 font-medium">envie novamente</button></span>
    </div>
  )
}

export default EmailSentPage
