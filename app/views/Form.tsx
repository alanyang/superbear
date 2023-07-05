import { useField, useIsSubmitting } from "remix-validated-form"

type InputProps = {
  name: string
  label: string
}

type SubmitProps = {
  label: string
  isSubmitting: boolean
}

export const Input = ({ name, label }: InputProps) => {
  const { error, getInputProps } = useField(name)
  return (
    <div className="flex flex-col font-thin">
      <div className="flex justify-between">
        <label htmlFor={name}>{label}</label>
        {error && (
          <span className="text-red-400">{error}</span>
        )}
      </div>
      <input {...getInputProps({ id: name })}
        className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />

    </div>
  )
}

export const Submit = ({ label, isSubmitting }: SubmitProps) => {
  return (
    <button type="submit"
      className="bg-blue-500 m-1 p-0.5 rounded  hover:bg-blue-300 text-white px-5 py-1 font-normal"
      disabled={isSubmitting}>{label}</button>
  )
}

export const Password = ({ name, label }: InputProps) => {
  const { error, getInputProps } = useField(name)
  return (
    <div className="flex flex-col font-thin">
      <div className="flex justify-between">
        <label htmlFor={name}>{label}</label>
        {error && (
          <span className="text-red-400">{error}</span>
        )}
      </div>
      <input {...getInputProps({ id: name })} type="password"
        className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />

    </div>
  )
}