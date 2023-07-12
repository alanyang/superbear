import { Link } from "@remix-run/react"
import TagItem from "./TagItem"
import moment from "moment"
import { useAppearanceStore } from "~/utils/store"

type Post = {
  id:string,
  title:string,
  content: string,
  author: { id: string, name: string},
  tags: Array<{id: string, name: string}>,
  createAt: Date
}

const maxViewLength = 580

export default ({id, title, content, author, tags, createAt }: Post) => {
  const view = useAppearanceStore( s=> s.view)

  if (content.length > maxViewLength) content = content.slice(0, maxViewLength) + '...'

  const width = view === 'grid' ? 'sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/6' : 'w-full'
  
  return (
    <section className={`flex flex-col ${width} gap-3 p-5 rounded hover:shadow-xl ease-in-out duration-300`}>
      <Link to={`/post/${id}`} className="underline font-normal text-xl">{title}</Link>
      <Link to={`/post/${id}`} className="font-extralight">{content}</Link>
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