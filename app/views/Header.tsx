import { Form, Link } from "@remix-run/react";

export default ({ user }) => (
  <div>
    <div className="flex items-end justify-between">
      <h3 className="text-4xl font-black">Superbear</h3>
      {
        user ?
          <span className="text-sm font-thin">
            <label className="px-2">{user.name}</label>
            <Form method="post" action="/user/logout" className="inline">
              <button type="submit" className="hover:border-slate-400 border rounded-sm border-slate-200 px-2">Logout</button>
            </Form>
          </span>
          :
          <span className="text-sm float-right font-thin">
            <Link to={'/user/login'}>Login</Link>
            <Link to={'/user/signup'} className="hover:border-slate-400 border rounded-sm border-slate-200 mx-2 px-2">Sign up</Link>
          </span>
      }
    </div>
  </div>
)