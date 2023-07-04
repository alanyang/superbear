//@ts-nocheck
import { ActionArgs, json, redirect } from "@remix-run/node"
import { useEffect, useState } from "react"
import { useFetcher } from "react-router-dom"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"

export async function action({ request }: ActionArgs) {
  const form = await request.formData()
  const { email, name, password } = Object.fromEntries(form)

  if (!email) {
    return json({ ok: 0, reason: 'Email is required' })
  }

  if (!password) {
    return json({ ok: 0, reason: 'password is required' })
  }

  await new Promise(r => setTimeout(r, 2000))
  const user = await prisma.user.create({
    data: {
      email, name, password: cryptoPassword(password), nick: name
    }
  })

  if(!user) {
    return json({ok :0, reason:'Email is used'})
  }

  return redirect('/user/login')
}

export default () => {
  const signupClient = useFetcher()
  const [reason, setReason] = useState('')
  useEffect(() => {
    if (signupClient.state === 'idle' && !signupClient.data?.ok) {
      setReason(signupClient.data?.reason)
    }
  }, [signupClient])
  return (
    <div>
      <signupClient.Form method="post" onChange={event => setReason('')}>
        <input type="text" placeholder="Email" name="email" className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        <input type="text" placeholder="name" name="name" className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        <input type="password" placeholder="password" name="password" className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        <button type="submit" className="bg-blue-500  m-1 p-2 rounded active:bg-blue-200 hover:bg-blue-300 focus:bg-blue-200 text-white px-3 font-thin">Sign up</button>
      </signupClient.Form>
      {
        reason && <div className="text-red-800">{reason}</div>
      }

      {
        signupClient.state == 'submitting' && <div className="text-blue-800">Submitting...</div>
      }
    </div>
  )
}