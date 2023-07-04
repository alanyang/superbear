import { json, type ActionArgs, type redirect } from "@remix-run/node"
import { useActionData } from "@remix-run/react"

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()

  return json({ name: 'useAction' })
}

export default () => {
  const data = useActionData()
  return (
    <section></section>
  )
}