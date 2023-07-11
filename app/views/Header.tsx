import { Link, useFetcher, useLocation } from "@remix-run/react";
import { useEffect } from "react";

import { Button } from "./Form";
import { useAppearance, useStore, useUIState } from "~/utils/store";

export default ({ user, showSwither }) => {
  const { pathname } = useLocation()
  const setTransition = useUIState(state => state.setTransition)
  const logoutClient = useFetcher()
  useEffect(() => {
    setTransition(logoutClient.state)
  }, [logoutClient])
  return (
    <div className="sticky top-0 backdrop-blur-sm bg-white/10 p-4 pt-5 shadow-sm">
      <TransitionPanel />
      <div className="flex justify-between items-center">
        <div className="flex gap-12 items-end">
          <Link to='/' className="text-4xl font-black">Superbear</Link>
          <div className="2xs:hidden xs:hidden sm:hidden md:hidden lg:flex xl:flex 2xl:flex">
            <Link to='/' className="mr-1 hover:underline">HOME</Link>
            {'/'}
            <Link to='/tag/all' className="ml-1 hover:underline mr-20">TAGS</Link>
          </div>
        </div>

        {
          user ?
            <div className="text-sm font-light flex justify-between">

              <SwitcherGroup show={showSwither} />
              <Link to="/user/me" className="px-2">{user.name}</Link>
              <logoutClient.Form method="post" action="/user/logout" className="inline">
                <input type="hidden" value={pathname} name="next" />
                <Button type="submit" _type="plain">Logout</Button>
              </logoutClient.Form>
            </div>
            :
            <div className="text-sm font-light flex justify-between">

              <SwitcherGroup show={showSwither} />
              <Link to={'/user/login'}>Login</Link>
              <Link to={'/user/signup'} className="ml-2">
                <Button _type="plain">Signup</Button>
              </Link>
            </div>
        }
      </div>
    </div>
  )
}

const TransitionPanel = () => {
  const  transitionState  = useUIState(state => state.transition)
  const position = transitionState === 'idle' ? '-right-80' : 'right-3'
  return (
    <div className={`fixed top-3 ${position} font-light ease-in-out duration-500`}>
      <div className="flex gap-3 shadow-lg rounded bg-blue-600/90 justify-center text-white p-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <label className="capitalize">{transitionState}...</label>
      </div>
    </div>
  )
}

const SwitcherGroup = ({ show }) => {
  const { view, theme } = show
  return (
    <div className="2xs:hidden xs:hidden sm:hidden md:hidden lg:flex xl:flex 2xl:flex justify-between">

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
  const view = useStore(useAppearance, state => state.view)
  const changeView = useAppearance(state => state.changeView)

  const gridBorder = view === 'list' ? 'border-slate-500' : 'border-slate-50'
  const listBorder = view === 'list' ? 'border-slate-500' : 'border-slate-50'

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
  const theme = useStore(useAppearance, state => state.theme)
  const changeTheme = useAppearance(state => state.changeTheme)
  const pos = theme === 'light' ? 'left-1' : 'left-2/4'
  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    changeTheme(newTheme)
  }
  return (
    <div className="mr-10 relative border border-slate-0 rounded-3xl px-1 py-0.5 w-30 flex justify-between cursor-pointer"
      onClick={e => toggle()}>
      <label className="pr-3">☀️</label>
      <label>🌙</label>
      <span className={`absolute ${pos} w-5 h-5 border border-slate-200 bg-slate-300 opacity-100 rounded-full ease-linear duration-100 transition-all`}></span>
    </div>
  )
}