//@ts-nocheck
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node"
import { Link, useFetcher, useLoaderData } from "@remix-run/react"
import { useContext, useEffect, useState } from "react"
import { getCurrentUser } from "~/utils/session.server"
import { prisma } from "~/utils/db.server"
import { userLoader } from "~/utils/loader.server"
import { PostValidator } from '~/utils/validtor'
import { Button, Input, TextArea } from "~/views/Form"
import { TransitionContext } from "~/utils/context"

export const loader = async ({ request, context }: LoaderArgs) => {
  const { user } = await userLoader({ request, context })
  if (!user) return redirect('/user/login?next=/post/new')

  return json({ ok: 1, user })
}

export const action = async ({ request }: ActionArgs) => {
  const user = await getCurrentUser(request)
  if (!user) return redirect('/user/login')

  const form = await request.formData()
  const result = await PostValidator.validate(form)
  if (result.error) {
    return json({
      ok: 0,
      reason: Object.entries(result.error.fieldErrors).map(([field, err]) => `<div>${field.toUpperCase()}:${err}</div>`).join('')
    })
  }
  const { title, content } = result.data
  const tags = result.data.tags.split(',').map(t => t.toLowerCase())

  const data = {
    title, content,
    author: {
      connect: { id: user.id }
    }
  }

  if (tags) {
    data.tags = { connectOrCreate: tags.map(name => ({ where: { name }, create: { name } })) }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tags: {
          connectOrCreate: tags.map(name => ({ where: { name }, create: { name } }))
        }
      }
    })
  }
  const post = await prisma.post.create({ data })
  if (!post) return json({ ok: 0, reason: 'Database error' })
  
  return redirect('/')
}

export default () => {
  useLoaderData() //check login

  const postClient = useFetcher()

  const [reason, setReason] = useState('')
  const [content, setContent] = useState('')

  const { setTransitionState } = useContext(TransitionContext)

  useEffect(() => {
    setTransitionState(postClient.state)
    if (postClient.state === 'idle' && !postClient.data?.ok) {
      setReason(postClient.data?.reason)
    }
  }, [postClient])

  return (
    <div>
      <div className="flex justify-center">
        <postClient.Form method="post" onChange={event => setReason('')}
          className="flex flex-col gap-3 w-1/2 mt-5 p-5 rounded shadow-salt-400  border-slate-100">
          <h3 className="text-xl font-bold pb-2">Write your post</h3>
          <Input type="text" placeholder="Title" name="title" />

          <TextArea placeholder="Write something" maxLength={65535} rows={8} onChange={event => setContent(event.currentTarget.value)} />

          <Input type="text" placeholder="Tags separate with ," name="tags" />

          <input type="hidden" name="content" value={content} />

          <div className="flex justify-end items-end">
            <Link to={'/'} className="mx-2 px-2 font-thin text-sm underline">Cancel</Link>
            <Button type="submit" _type="primary" _size="medium">Submit post</Button>
          </div>

          {
            reason && <div className="text-red-500 flex justify-end" dangerouslySetInnerHTML={{ __html: reason }}></div>
          }
          
        </postClient.Form>
      </div>

    </div>
  )
}