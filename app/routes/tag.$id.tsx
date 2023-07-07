import { LoaderArgs, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/db.server"
import PostItem from "~/views/PostItem"
import { tagColor } from "~/views/TagItem"

export const loader = async ({ params }: LoaderArgs) => {
  const { id } = params
  const tag = await prisma.tag.findUnique({
    where: { id },
    select: {
      id: true, name: true, posts: {
        select: {
          id: true, title: true, content: true, author: true
        }
      }
    }
  })

  return json({ ok: 1, tag })
}

export default () => {
  const { tag } = useLoaderData()
  const color = tagColor(tag.name)
  return (
    <div className="p-0">
      <div className="px-5 pt-10">
        <Link to={`/tag/${tag.id}`} className={`font-bold p-1 rounded text-white text-xl ${color}`}>#{tag.name}</Link>
      </div>
      <div className={`flex gap-0 mt-5 flex-wrap`}>
        {
          tag.posts.map(post => <PostItem key={post.id} {...post} />)
        }
      </div>
    </div>
  )
}