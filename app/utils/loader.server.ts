import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node"
import { getCurrentUser } from "./session.server"

export async function loadUser({ request, context }: LoaderArgs | ActionArgs){
  if (context.user)
    return { user: context.user }

  const user = await getCurrentUser(request)

  if (user) context.user = user
  return { user }
}

export async function loginedRedirect(args: LoaderArgs | ActionArgs) {
  const { user } = await loadUser(args)
  if (user) return redirect('/user/me')
  return json({})
}