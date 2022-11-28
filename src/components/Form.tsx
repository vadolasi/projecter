import React from "react"
import { FieldValues, SubmitHandler, useForm, UseFormProps } from "react-hook-form"

type Props<T extends FieldValues> = {
  onDone: SubmitHandler<T>
} & UseFormProps<T> & React.InputHTMLAttributes<HTMLFormElement>

function Form<T extends FieldValues>({ children, onDone, defaultValues, mode, resolver, ...rest }: Props<T>) {
  const { register, formState: { errors }, handleSubmit } = useForm<T>({ defaultValues, mode, resolver })

  return (
    <form onSubmit={handleSubmit(onDone)} className="flex flex-col gap-2 w-full p-4 md:(w-1/2 p-0) lg:w-1/4">
      {React.Children.map(children, untypefChild => {
        const child = untypefChild as React.ReactElement
        return child.props.name
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register,
                key: child.props.name,
                error: errors[child.props.name]
              }
            })
          : child
      })}
    </form>
  )
}

export default Form
