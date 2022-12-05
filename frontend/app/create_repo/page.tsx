"use client"

import { NextPage } from "next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

const schema = z.object({
  name: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
    .max(30, "Este nome é muito longo. Inclua no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Este nome contém caracteres inválidos. Use apenas letras, números, hífens e sublinhados"),
  description: z.string({ required_error: "Este campo é obrigatório" })
    .min(1, "Este campo é obrigatório")
    .max(255, "Esta descrição é muito longa. Inclua no máximo 255 caracteres")
})

const CreatRepoPage: NextPage = () => {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  const onSubmit = handleSubmit(async data => {
    await fetch(`http://localhost:8000/repos/${data.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })

    router.push(`/repos/${data.name}`)
  })

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <form onSubmit={onSubmit} className="flex flex-col p-4 md:(w-1/2) lg:w-1/4">
        <h1 className="text-center font-bold text-lg mb-7">Criar repositório</h1>
        <label htmlFor="name" className={`text-base ${errors.name ? "text-red-500" : ""}`}>Nome</label>
        <input type="text" id="name" className={`p-2 border rounded-lg focus:outline-none ${errors.name ? "border-red-500 text-red-500" : ""}`} {...register("name")} />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        <label htmlFor="description" className={`mt-2 text-base ${errors.description ? "text-red-500" : ""}`}>Descrição</label>
        <textarea id="description" className={`p-2 border rounded-lg focus:outline-none ${errors.description ? "border-red-500 text-red-500" : ""}`} {...register("description")} />
        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        <button disabled={isSubmitting} type="submit" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full">Criar repositório</button>
      </form>
    </div>
  )
}

export default CreatRepoPage
