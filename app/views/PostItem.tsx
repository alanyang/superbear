//@ts-nocheck

import { Link } from "@remix-run/react"

const maxViewLength = 250
export default ({ id, title, content, User }: {content: String}) => {
  if(content.length > maxViewLength) content = content.slice(0, maxViewLength) + '...'
  return (
    <Link to={`/post/${id}`} className="flex flex-col w-1/5 gap-3 p-5 rounded shadow-salt-400 border-slate-100 hover:shadow-xl ease-in-out duration-300">
      <h3 className="underline font-normal text-xl">{title}</h3>
      <section className="font-thin">{content}</section>
      <label className="font-thin text-sm text-blue-400">@{User.name}</label>
    </Link>

  )
}