//@ts-nocheck
import { Form, Link } from "@remix-run/react";
import { useContext, useState } from "react";

import { AppearanceContext } from "~/utils/context";

export default ({ user, showSwither }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Link to='/' className="text-4xl font-black">Superbear</Link>


        {
          user ?
            <div className="text-sm font-thin flex justify-between">
              <Link to='/' className="mr-1 hover:underline">HOME</Link>
              {'/'}
              <Link to='/tag/all' className="ml-1 hover:underline mr-20">TAGS</Link>
              <SwitcherGroup show={showSwither} />
              <Link to="/user/me" className="px-2">{user.name}</Link>
              <Form method="post" action="/user/logout" className="inline">
                <button type="submit" className="hover:border-slate-400 border rounded-sm border-slate-200 px-2">Logout</button>
              </Form>
            </div>
            :
            <div className="text-sm float-right font-thin flex justify-between">
              <SwitcherGroup show={showSwither} />
              <Link to={'/user/login'}>Login</Link>
              <Link to={'/user/signup'} className="hover:border-slate-400 border rounded-sm border-slate-200 mx-2 px-2">Sign up</Link>
            </div>
        }
      </div>
    </div>

  )
}

const SwitcherGroup = ({ show }) => {
  const { view, theme } = show
  return (
    <div className="flex justify-between">

      {
        theme && <ThemeSwither />
      }

      {
        view && <ViewSwither />
      }
    </div>
  )
}

const ViewSwither = () => {
  const { view, changeView } = useContext(AppearanceContext)

  const gridBorder = view === 'grid' ? 'border-slate-200' : 'border-slate-50'
  const listBorder = view === 'list' ? 'border-slate-200' : 'border-slate-50'

  return (
    <div className="pr-5">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        onClick={event => changeView('grid')}
        className={`w-5 h-5 inline mr-2 rounded-sm border ${gridBorder} hover:border-slate-400 cursor-pointer`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        onClick={event => changeView('list')}
        className={`w-5 h-5 inline rounded-sm border ${listBorder} hover:border-slate-400 cursor-pointer`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>
  )
}

const ThemeSwither = () => {
  const { theme, changeTheme } = useContext(AppearanceContext)
  const [pos, setPos] = useState(theme == 'light' ? 'left-1' : 'left-2/4')
  const _changeTheme = () => {
    if (theme === 'light') {
      changeTheme('dark')
      setPos('left-2/4')
    } else {
      changeTheme('light')
      setPos('left-1')
    }
  }
  return (
    <div className="mr-10 relative border border-slate-0 rounded-3xl px-1 py-0.5 w-30 flex justify-between cursor-pointer"
      onClick={e => _changeTheme()}>
      <label className="pr-3">☀️</label>
      <label>🌙</label>
      <span className={`absolute ${pos} w-5 h-5 border border-slate-200 bg-slate-300 opacity-100 rounded-full ease-linear duration-100 transition-all`}></span>
    </div>
  )
}