import { Link } from "@remix-run/react"
import moment from "moment"
import { useContext } from "react"
import { AppearanceContext } from "~/utils/context"
import { Button } from "./Form"

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
  const { theme } = useContext(AppearanceContext)
  const color = theme === 'dark'? 'bg-slate-600 text-slate-100': 'bg-slate-100 text-slate-700'
  return (
    <section className="flex flex-col">
      <textarea rows={2} maxLength={4000} ref={_ref} placeholder="Write something"
        className={`${color} border-blue-500 border m-1 p-2 rounded active:border-blue-200 hover:border-blue-300 focus:border-blue-200 focus:outline-none`} />
      <button
        onClick={action}
        className="bg-blue-500 m-1 px-7 py-1 rounded hover:bg-blue-300 text-white">Add Comment</button>
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