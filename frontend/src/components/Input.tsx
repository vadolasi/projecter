import { FieldError, UseFormRegister } from "react-hook-form"

type Props = {
  label: string
  error?: FieldError | undefined
  register?: UseFormRegister<any>
  isLoading?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<Props> = ({ label, error, register, isLoading, ...props }) => {
  return (
    <>
      <label htmlFor="email" className={`${error ? "text-red-500" : ""}`}>{label}</label>
      <input type="email" {...props} {...register!(props.name!)} disabled={isLoading} className={`p-2 border-2 rounded-lg focus:outline-none ${error ? "border-red-300 text-red-500" : ""}`} />
      {error && <span className="text-red-400 text-sm font-medium">{error.message}</span>}
    </>
  )
}

export default Input
