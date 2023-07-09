//@ts-nocheck
import { ActionArgs, json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { useFetcher } from "react-router-dom"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"
import { loginedRedirect } from "~/utils/loader.server"
import { SignupValidator } from "~/utils/validtor"
import { Button, Input } from "~/views/Form"

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

  try {
    await prisma.user.create({
      data: {
        email, name, password: cryptoPassword(password), nick: name
      }
    })
    return redirect('/user/login')
  } catch (err) {
    return json({ ok: 0, reason: 'Email is registered' })
  }
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
      <signupClient.Form method="post" onChange={event => setReason('')} className="flex flex-col font-thin gap-3 w-96 p-5 rounded hover:shadow-xl ease-in-out duration-300">
        {/* <h3 className="text-3xl font-semibold pb-3">Sign up to Superbear</h3> */}
        <div className="flex flex-col">
          <label htmlFor="em" className="px-2 font-extralight">Email</label>
          <Input type="text" placeholder="Enter your email" name="email" id="em" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="em" className="px-2 font-extralight">Nickname</label>
          <Input type="text" placeholder="Enter your nickname (option)" name="name" id="em" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pw" className="px-2 font-extralight">Password</label>
          <Input type="password" name="password" id="pw" placeholder="Enter your password" />
        </div>
        <div className="flex justify-end items-center gap-1 font-thin pt-2">
          <Link to="/" className="font-thin underline pr-4 text-sm pt-1">Cancel</Link>
          <Button to="/user/login">Login</Button>
          <Button type="submit" _type="sucess">Sign up</Button>
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