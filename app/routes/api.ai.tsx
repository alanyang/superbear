import { json, type LoaderArgs, type ActionArgs } from "@remix-run/node"
export async function loader({ request }: LoaderArgs) {
  return json({
    name: 'loader',
    ai: request.url
  })
}

export async function action({ request }: ActionArgs) {
  const { method }= request
  return json({ method })
}