import { Link } from "@remix-run/react"
import moment from "moment"
import { Button } from "./Form"
import { useAppearanceStore } from "~/utils/store"

export const CommentItem = ({ content, creator, createAt }) => {
  return (
    <div className="flex flex-col gap-1 py-3 font-thin text-sm">
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

export const CommentForm = ({ _ref, action }) => {
  const theme = useAppearanceStore(s => s.theme)
  const color = theme === 'dark' ? 'bg-slate-600 text-slate-100' : 'bg-slate-100 text-slate-700'
  return (
    <section className="flex flex-col items-center">
      <textarea rows={2} maxLength={4000} ref={_ref} placeholder="Write something"
        className={`${color} w-full border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none`} />
      <Button onClick={action} _type="primary" _size="full">Add Comment</Button>
    </section>
  )
}

export const AuthButtonGroup = ({ id }) => {
  return (
    <section className="flex flex-col items-center gap-2 my-5 mx-5">
      <h4>Login for write comment</h4>
      <div className="flex justify-center gap-3">
        <Link to="/user/signup">
          <Button _type="info">Signup</Button>
        </Link>
        <Link to={`/user/login?next=/post/${id}`}>
          <Button _type="primary">Login</Button>
        </Link>
      </div>
    </section>

  )
}