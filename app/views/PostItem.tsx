//@ts-nocheck

import { Link } from "@remix-run/react"
import TagItem from "./TagItem"

const maxViewLength = 250
export default ({ id, title, content, User, tags }: { content: String }) => {
  if (content.length > maxViewLength) content = content.slice(0, maxViewLength) + '...'
  return (
    <section className="flex flex-col w-1/5 gap-3 p-5 rounded shadow-salt-400 border-slate-100 hover:shadow-xl ease-in-out duration-300">
      <Link to={`/post/${id}`} className="underline font-normal text-xl">{title}</Link>
      <Link to={`/post/${id}`} className="font-thin">{content}</Link>
      <div className="flex flex-wrap gap-1">
        {
          tags.map((tag, index) => <TagItem key={tag.id} {...tag} index={index} />)
        }
      </div>

      <Link to={`/user/${User.id}`} className="font-thin text-sm text-blue-400">@{User.name}</Link>
    </section>
  )
}