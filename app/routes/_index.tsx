//@ts-nocheck
import { ActionArgs, json, LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import PostItem from "~/views/PostItem";
import { AppearanceContext, ViewContext } from "~/utils/context";
import { useContext, useState } from "react";
import { viewCookie } from "~/cookie";


export const meta: V2_MetaFunction = () => {
  return [
    { title: "Superbear discuss" },
    { name: "Superbear discuss", content: "Discuss any issues freely and openly" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true, author: { select: { name: true, id: true } }, tags: true, createAt: true },
    orderBy: { createAt: 'desc' },
  })

  return json({ ok: 1, posts })
}

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData()
  const { _action, view } = Object.fromEntries(data)
  switch (_action) {
    case 'changeView':
      if (invalidViews.includes(view))
        return json({ ok: 0 }, { headers: { "Set-Cookie": await viewCookie.serialize(view) } })
  }
  return json({ ok: 1 })
}

export default function Index() {
  const { posts } = useLoaderData()
  const { view } = useContext(AppearanceContext)

  const flex = view === 'grid' ? 'flex' : 'flex-col'
  return (
      <div className="p-0">
        <div className={`${flex} gap-0 mt-5 flex-wrap`}>
          {
            posts.map(post => <PostItem key={post.id} {...post} />)
          }
        </div>

        <Link to='/post/new' 
        className="fixed bottom-14 right-14 w-14 h-14 bg-blue-400 rounded-full text-slate-50 flex justify-center items-center hover:bg-blue-700 hover:shadow-lg shadow-sm ease-in-out duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

        </Link>
      </div>

  )
}
