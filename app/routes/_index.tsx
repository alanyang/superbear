//@ts-nocheck
import { json, LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { getCurrentUser } from "~/session";
import { prisma } from "~/utils/db.server";
import Header from "~/views/Header";
import PostItem from "~/views/PostItem";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Superbear discuss" },
    { name: "Superbear discuss", content: "Discuss any issues freely and openly" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getCurrentUser(request)

  const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true, User: { select: { name: true, id: true } }, tags: true},
    orderBy: { createAt: 'desc' }
  })
  return json({ user, posts })
}


export default function Index() {
  const { user, posts } = useLoaderData()

  return (
    <div className="p-0">
      <Header user={user} />
      <div className="flex gap-0 mt-5 flex-wrap">
        {
          posts.map(post => <PostItem key={post.id} {...post} />)
        }
      </div>

      <Link to='/post/new' className="fixed bottom-10 right-10 w-12 h-12 bg-blue-400 rounded-full text-slate-50 flex justify-center items-center hover:bg-blue-600 ease-in-out duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

      </Link>
    </div>
  );
}
