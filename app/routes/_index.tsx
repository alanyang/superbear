import { json, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import PostItem from "~/views/PostItem";
import { useAppearanceStore } from "~/utils/store";

export const loader = async ({ request }: LoaderArgs) => {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true, author: { select: { name: true, id: true } }, tags: true, createAt: true },
    orderBy: { createAt: 'desc' },
  })

  return json({ ok: 1, posts })
}

export default function Index () {
  const { posts } = useLoaderData()
  const appearance = useAppearanceStore()

  const flex = appearance.view === 'grid' ? 'flex' : 'flex-col'
  return (
    <div className="p-4">
      <div className={`${flex} gap-0 mt-5 flex-wrap`}>
        {
          posts.map(post => <PostItem key={post.id} {...post} />)
        }
      </div>

      <Link to='/post/new'
        className="fixed bottom-14 right-14 w-14 h-14 bg-blue-400 rounded-full text-slate-50 flex justify-center items-center hover:bg-blue-700 shadow-lg ease-in-out duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
    </div>
  )
}