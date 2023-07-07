import { Link } from "@remix-run/react"
import moment from "moment"

export default ({ content, creator, createAt}) => {
  return (
    <div className="flex flex-col gap-1 py-2 font-thin text-sm">
      <div className="flex justify-between">
        <Link to={`/user/${creator.id}`} className="text-blue-400">@{creator.name}</Link>
        <label className="text-xs">{moment(createAt).endOf('day').fromNow()}</label>
      </div>
      <article>
        {content}
      </article>
    </div>
  )
}