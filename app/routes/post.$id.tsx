//@ts-nocheck
import { ActionArgs, json, redirect, type LoaderArgs } from "@remix-run/node"
import { Link, useFetcher, useLoaderData } from "@remix-run/react"
import moment from "moment"
import { useContext, useRef } from "react"
import { UserContext } from "~/utils/context"
import { prisma } from "~/utils/db.server"
import { userLoader } from "~/utils/loader.server"
import { CommentValidtor } from "~/utils/validtor"
import CommentItem from "~/views/CommentItem"
import TagItem from "~/views/TagItem"

export async function loader({ request, params }: LoaderArgs) {
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
  return json({ ok: 1, post })
}

export async function action({ request, params, context }: ActionArgs) {
  const form = await request.formData()
  const result = await CommentValidtor.validate(form)
  const { user } = await userLoader({ request, context })
  const { id } = params

  if (!user) return redirect('/user/login')

  if (result.error) {
    return json({
      ok: 0,
      reason: Object.entries(result.error.fieldErrors).map(([field, err]) => `<div>${field.toUpperCase()}:${err}</div>`).join('')
    })
  }
  const { content } = result.data
  await prisma.comment.create({
    data: {
      content: content.trim(),
      post: { connect: { id } },
      creator: { connect: { id: user.id } }
    }
  })
  return redirect(`/post/${id}`)
}

export default () => {
  const { post } = useLoaderData()
  const { user } = useContext(UserContext)
  const contentRef = useRef()
  const commentClient = useFetcher()

  const addComment = () => {
    commentClient.submit({ content: contentRef.current.value }, { method: 'post' })
    contentRef.current.value = ''
  }
  return (
    <div className="flex flex-col mt-5 font-thin">
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
        user && <CommentSection _ref={contentRef} action={addComment} /> || <UserButtonGroup id={post.id} />
      }

    </div>
  )
}

const CommentSection = ({ _ref, action }) => (
  <section className="flex flex-col">
    <textarea rows={2} maxLength={4000} ref={_ref} placeholder="Write something"
      className="border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none text-slate-500" />
    <button
      onClick={action}
      className="bg-blue-500 m-1 px-7 py-1 rounded hover:bg-blue-300 text-white">Add Comment</button>
  </section>
)

const UserButtonGroup = ({ id }) => {
  return (
    <section className="flex flex-col items-center gap-2 my-5 mx-5">
      <h4>Login for write comment</h4>
      <div className="flex justify-center gap-3">
        <Link to="/user/signup" className="bg-slate-400  m-1 px-7 py-0.5 rounded hover:bg-slate-600 text-white duration-500 ease-in-out">Signup</Link>
        <Link to={`/user/login?next=/post/${id}`} className="bg-blue-500  m-1 px-7 py-0.5 rounded hover:bg-blue-700 text-white duration-500 ease-in-out">Login</Link>
      </div>
    </section>

  )
}