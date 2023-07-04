//@ts-nocheck
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node"
import { Link, useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { getCurrentUser } from "~/session"
import { prisma } from "~/utils/db.server"
import Header from "~/views/Header"

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getCurrentUser(request)
  if (!user) return redirect('/user/login')
  return json({ user })
}

export const action = async ({ request }: ActionArgs) => {
  const user = await getCurrentUser(request)
  if (!user) return redirect('/user/login')

  const form = await request.formData()
  const { title, content, ...other } = Object.fromEntries(form)
  if (!title) return json({ ok: 0, reason: 'Title is required' })
  if (!content) return json({ ok: 0, reason: 'Content is required' })

  const post = await prisma.post.create( {
    data: {
      title, content,
      User: {
        connect: { id: user.id }
      }
    }
  })

  if(post) return redirect('/')
}

export default () => {
  const { user } = useLoaderData()
  const postClient = useFetcher()

  const [reason, setReason] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (postClient.state === 'idle' && !postClient.data?.ok) {
      setReason(postClient.data?.reason)
    }
  }, [postClient])

  return (
    <div>
      <Header user={user} />
      <div className="flex justify-center">
        <postClient.Form method="post" onChange={event => setReason('')}
          className="flex flex-col gap-3 w-1/2 mt-5 p-5 rounded shadow-salt-400  border-slate-100">
          <h3 className="text-xl font-bold pb-2">Write your post</h3>
          <input type="text" placeholder="Title" name="title" className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />
          <input type="text" placeholder="Tag" name="tag" className="border-blue-500 hidden border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />

          <textarea placeholder="Post content" maxLength="800" rows="8" onChange={event => setContent(event.currentTarget.value)}
            className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none" />

          <input type="hidden" name="content" value={content} />

          <div className="flex justify-end items-end">
            <Link to={'/'} className="mx-2 px-2 font-thin text-sm underline">Cancel</Link>
            <button type="submit" name="_action" value="create" className="bg-blue-500 m-1 p-0.5 rounded active:bg-blue-200 hover:bg-blue-300 focus:bg-blue-200 text-white px-3 py-1 font-thin ">Submit post</button>
          </div>

          {
            reason && <div className="text-red-500 flex justify-end">{reason}</div>
          }
          {
            postClient.state === 'submitting' && <div className="text-blue-500">...</div>
          }
        </postClient.Form>
      </div>

    </div>
  )
}