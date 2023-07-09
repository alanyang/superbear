//@ts-nocheck
import { ActionArgs, json, redirect } from "@remix-run/node"
import { Link, useFetcher, useLoaderData, useSearchParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import { commitSession, getSession } from "~/utils/session.server"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"
import { loginedRedirect } from "~/utils/loader.server"
import { LoginValidator } from "~/utils/validtor"
import { Button, Input } from "~/views/Form"

export const loader = loginedRedirect

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const result = await LoginValidator.validate(formData)

  if (result.error) {
    return json({
      ok: 0,
      reason: Object.entries(result.error.fieldErrors).map(([field, err]) => `<div>${field.toUpperCase()}:${err}</div>`).join('')
    })
  }

  const { email, password, next } = result.data


  const user = await prisma.user.findFirst({ where: { email, password: cryptoPassword(password) }, select: { id: true, email: true, name: true } })
  if (!user) {
    return json({ ok: 0, reason: 'Email or Password error' })
  }

  const session = await getSession(request.headers.get('Cookie'))
  session.set('user', JSON.stringify(user))
  await prisma.user.update({where: {id: user.id}, data: {
    lastLoginAt: new Date()
  }})
  return redirect(next || '/', { headers: { 'Set-Cookie': await commitSession(session) } })
}


export default () => {
  useLoaderData()

  const [searchParams] = useSearchParams()

  const loginClient = useFetcher()
  const [reason, setReason] = useState([])

  useEffect(() => {
    if (loginClient.state === 'idle' && !loginClient.data?.ok) {
      if (loginClient.data?.reason) setReason(loginClient.data?.reason)
    }
  }, [loginClient])

  return (
    <div className="flex justify-center">
      <loginClient.Form method="post" onChange={e => setReason('')} className="flex flex-col font-thin gap-3 w-96 p-5 rounded hover:shadow-xl ease-in-out duration-300">
        {/* <h3 className="text-3xl font-semibold pb-3">Login to Superbear</h3> */}
        {
          searchParams.has('next') && <input type="hidden" name="next" value={searchParams.get('next')} />
        }
        <div className="flex flex-col">
          <label htmlFor="em" className="px-2 font-extralight">Email</label>
          <input type="text" placeholder="Enter your email" name="email" id="em"
            className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pw" className="px-2 font-extralight">Password</label>
          <Input type="password" name="password" id="pw" placeholder="Enter your password" />
        </div>

        <div className="flex justify-end items-center gap-1 font-thin pt-2">
          <Link to="/" className="font-thin underline pr-4 text-sm pt-1">Cancel</Link>
          <Link to="/">
            <Button _type="info">Sigup</Button>
          </Link>
          <Button type="submit" _type="primary">Login</Button>
        </div>
        {
          reason && <div className="text-red-500 text-xs" dangerouslySetInnerHTML={{ __html: reason }} />
        }
        {
          loginClient.state === 'submitting' && <div className="text-blue-500">...</div>
        }
      </loginClient.Form>

    </div>
  )
}
