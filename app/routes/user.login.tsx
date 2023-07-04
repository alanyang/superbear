//@ts-nocheck

import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { commitSession, getSession } from "~/session"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('user')) {
    return redirect('/')
  }

  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()

  const { email, password } = Object.fromEntries(formData)
  if (!email) {
    return json({ ok: 0, reason: 'Email required' })
  }
  if (!password) {
    return json({ ok: 0, reason: 'Password required' })
  }

  const user = await prisma.user.findFirst({ where: { email, password: cryptoPassword(password) }, select: { id: true, email: true, name: true } })
  if (!user) {
    return json({ ok: 0, reason: 'Email or Password error' })
  }

  const session = await getSession(request.headers.get('Cookie'))
  session.set('user', JSON.stringify(user))

  return redirect('/', { headers: { 'Set-Cookie': await commitSession(session) } })
}

export default () => {

  useLoaderData()

  const loginClient = useFetcher()
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (loginClient.state === 'idle') {
      // console.log(loginClient.data)
      !loginClient.data?.ok && setReason(loginClient.data?.reason)
    }
  })

  return (
    <div className="flex justify-center">
      <loginClient.Form method="post" onChange={event => setReason('')} className="flex flex-col gap-3 w-96 mt-48 p-5 rounded shadow-salt-400 shadow-lg border border-slate-100">
        <h3 className="text-3xl font-black pb-3">Login to Superbear</h3>
        <input type="text" placeholder="Email" name="email" className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        <input type="password" placeholder="password" name="password" className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        <button type="submit" className="bg-blue-500 font-normal  m-1 p-2 rounded active:bg-blue-200 hover:bg-blue-300 focus:bg-blue-200 text-white px-3">Login</button>
        {
          reason && <div className="text-red-500">{reason}</div>
        }
        {
          loginClient.state === 'submitting' && <div className="text-blue-500">...</div>
        }
      </loginClient.Form>

    </div>
  )
}