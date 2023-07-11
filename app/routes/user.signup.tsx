import { ActionArgs, json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { useFetcher } from "react-router-dom"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"
import { loginedRedirect } from "~/utils/loader.server"
import { useUIState } from "~/utils/store"
import { SignupValidator } from "~/utils/validator"
import { Button, Input } from "~/views/Form"

export const loader = loginedRedirect

export async function action ({ request }: ActionArgs) {
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
  const setTransitionState = useUIState(state => state.setTransition)
  useEffect(() => {
    setTransitionState(signupClient.state)
    if (signupClient.state === 'idle' && !signupClient.data?.ok) {
      setReason(signupClient.data?.reason)
    }
  }, [signupClient])
  return (
    <div className="flex justify-center">
      <signupClient.Form method="post" onChange={event => setReason('')} className="flex flex-col font-thin gap-3 w-96 p-5 rounded hover:shadow-xl ease-in-out duration-300">
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
          <Link to="/" className="font-thin underline pr-4 text-sm pt-1">
            Cancel
          </Link>
          <Link to="/user/login" className="bg-slate-500 px-7 py-1 font-normal text-base rounded hover:bg-slate-800 text-white duration-500 ease-in-out">
            Login
          </Link>

          <Button type="submit" _type="primary">Sign up</Button>
        </div>
        {
          reason && <div className="text-red-500 text-xs" dangerouslySetInnerHTML={{ __html: reason }} />
        }
      </signupClient.Form>


    </div>
  )
}