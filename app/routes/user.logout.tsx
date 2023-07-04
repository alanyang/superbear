import { ActionArgs, redirect } from "@remix-run/node"
import { destroySession, getSession } from "~/session"

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  return redirect('/', {headers: {"Set-Cookie": await destroySession(session)}})
}