//@ts-nocheck

import { Link } from "@remix-run/react"
import TagItem from "./TagItem"
import { useContext } from "react"
import { AppearanceContext } from "~/utils/context"
import moment from "moment"

const maxViewLength = 250
export default ({ id, title, content, author, tags, createAt }: { content: String }) => {
  const { view, theme } = useContext(AppearanceContext)

  if (content.length > maxViewLength) content = content.slice(0, maxViewLength) + '...'

  const width = view === 'grid' ? 'w-1/5' : 'w-full'
  const shadow = theme === 'light' ? 'shadow-gray-200': 'shadow-gray-200'
  
  return (
    <section className={`flex flex-col ${width} gap-3 p-5 rounded border-slate-100 hover:shadow-lg hover:${shadow} ease-in-out duration-300`}>
      <Link to={`/post/${id}`} className="underline font-normal text-xl">{title}</Link>
      <Link to={`/post/${id}`} className="font-thin">{content}</Link>
      <div className="flex flex-wrap gap-1">
        {
          tags && tags.map( tag => <TagItem key={tag.id} {...tag} />)
        }
      </div>
      <div className="flex justify-between items-center font-thin text-sm">
        <Link to={`/user/${author.id}`} className="text-blue-400">@{author.name}</Link>
        <label className="text-xs">{moment(createAt).endOf('day').fromNow()}</label>
      </div>

    </section>
  )
}