//@ts-nocheck
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { useFetcher } from "react-router-dom"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"
import { loginedRedirect } from "~/utils/loader.server"
import { SignupValidator } from "~/utils/validtor"

export const loader = loginedRedirect

export async function action({ request }: ActionArgs) {
  const form = await request.formData()

  const result = await SignupValidator.validate(form)

  if (result.error) {
    return json({
      ok: 0,
      reason: Object.entries(result.error.fieldErrors).map(([field, err]) => `<div>${field.toUpperCase()}:${err}</div>`).join('')
    })
  }

  const { email, password, name } = result.data

  const user = await prisma.user.create({
    data: {
      email, name, password: cryptoPassword(password), nick: name
    }
  })

  if (!user) {
    return json({ ok: 0, reason: 'Email is used' })
  }

  return redirect('/user/login')
}

export default () => {
  useLoaderData()

  const signupClient = useFetcher()
  const [reason, setReason] = useState('')
  useEffect(() => {
    if (signupClient.state === 'idle' && !signupClient.data?.ok) {
      setReason(signupClient.data?.reason)
    }
  }, [signupClient])
  return (
    <div className="flex justify-center">
      <signupClient.Form method="post" onChange={event => setReason('')} className="flex flex-col font-thin gap-3 w-96 mt-32 p-5 rounded shadow-salt-0 shadow-lg border border-slate-200">
        <h3 className="text-3xl font-semibold pb-3">Sign up to Superbear</h3>
        <div className="flex flex-col">
          <label htmlFor="em" className="px-2 font-extralight">Email</label>
          <input type="text" placeholder="Enter your email" name="email" id="em"
            className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="em" className="px-2 font-extralight">Nickname</label>
          <input type="text" placeholder="Enter your nickname (option)" name="name" id="em"
            className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pw" className="px-2 font-extralight">Password</label>
          <input type="password" name="password" id="pw" placeholder="Enter your password"
            className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        </div>
        <div className="flex justify-end items-center gap-1 font-thin pt-2">
          <Link to="/" className="font-thin underline pr-4 text-sm pt-1">Cancel</Link>
          <Link to="/user/login" className="bg-slate-400 m-1 rounded  hover:bg-slate-600 text-white px-2 py-1 font-thin">Login</Link>
          <button type="submit" className="bg-blue-500 font-normal  m-1 px-7 py-1 rounded hover:bg-blue-300 text-white">Sign up</button>
        </div>
        {
          reason && <div className="text-red-500 text-xs" dangerouslySetInnerHTML={{ __html: reason }} />
        }
        {
          signupClient.state === 'submitting' && <div className="text-blue-500">...</div>
        }
    
      </signupClient.Form>


    </div>
  )
}