import { ActionArgs, json, redirect, type LoaderArgs } from "@remix-run/node"
import { Link, useFetcher, useLoaderData } from "@remix-run/react"
import moment from "moment"
import { useEffect, useRef } from "react"
import { prisma } from "~/utils/db.server"
import { userLoader } from "~/utils/loader.server"
import { useUIState } from "~/utils/store"
import { CommentValidtor } from "~/utils/validator"
import { AuthButtonGroup, CommentForm, CommentItem } from "~/views/Comment"
import TagItem from "~/views/TagItem"
import { shallow } from "zustand/shallow"

export async function loader ({ request, params, context }: LoaderArgs) {
  const { id } = params
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true, title: true, content: true, createAt: true,
      tags: {
        select: { id: true, name: true }
      },
      author: {
        select: { id: true, name: true }
      },
      comments: {
        select: { id: true, content: true, createAt: true, creator: { select: { id: true, name: true } } },
        orderBy: { createAt: 'desc' }
      }
    }
  })
  const user = await userLoader({ request, params, context })
  return json({ ok: 1, post, user })
}

export async function action ({ request, params, context }: ActionArgs) {
  const form = await request.formData()
  const result = await CommentValidtor.validate(form)
  const { user } = await userLoader({ request, context, params })
  const { id } = params

  if (!user) return redirect('/user/login')

  if (result.error) {
    return json({
      ok: 0,
      reason: Object.entries(result.error.fieldErrors).map(([field, err]) => `<div>${field.toUpperCase()}:${err}</div>`).join('')
    })
  }
  const { content } = result.data

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        post: { connect: { id } },
        creator: { connect: { id: user.id } }
      }
    })

    return redirect(`/post/${id}`)
  } catch (err) {
    return json({ ok: 0, reason: "Database error" })
  }
}

export default () => {
  const { post, user } = useLoaderData()
  const contentRef = useRef<HTMLTextAreaElement>()
  const commentClient = useFetcher()

  const [transition, setTransition] = useUIState(s => [s.transition, s.setTransition], shallow)
  const addComment = () => {
    commentClient.submit({ content: contentRef.current.value }, { method: 'post' })
    contentRef.current.value = ''
  }

  useEffect(() => setTransition(commentClient.state), [commentClient])

  return (
    <div className="flex flex-col mt-5 font-extralight">
      <section className="flex justify-between items-end py-3">
        <label className="text-xl font-bold">{post.title}</label>
        <label className="text-sm">
          <Link to={`/user/${post.author.id}`} className="pr-1 font-normal text-blue-400">@{post.author.name}</Link>
          created {moment(post.createAt).endOf('day').fromNow()}
        </label>
      </section>

      <section>{post.content}</section>

      <section className="flex gap-2 mt-3">
        {
          post.tags && post.tags.map(it => <TagItem key={it.id} {...it} />)
        }
      </section>

      <section className="flex flex-col mt-8">
        <h3 className="my-3 font-semibold text-lg">Comments</h3>
        {
          post.comments && post.comments.map(it => <CommentItem key={it.id} {...it} />)
        }
      </section>
      {
        user && <CommentForm _ref={contentRef} action={addComment} /> || <AuthButtonGroup id={post.id} />
      }
      <commentClient.Form className="hidden"></commentClient.Form>
    </div>
  )
}