import { ActionArgs, redirect } from "@remix-run/node"
import { destroySession, getSession } from "~/utils/session.server"

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const { next } = Object.fromEntries(await request.formData())
  return redirect(next as string || '/', { headers: { "Set-Cookie": await destroySession(session) } })
}
