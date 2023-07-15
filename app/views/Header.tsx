import { Link, useFetcher, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

import { Button } from "./Form";
import { appearanceState, useAppearance, useUI, uiState, useCurrent } from "~/utils/store";

export default ({ showItems }) => {
  const user = useCurrent()
  const { pathname } = useLocation()
  const logoutClient = useFetcher()

  useEffect(() => { uiState.setTransition(logoutClient.state) }, [logoutClient])

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
            <div className="text-sm font-light flex">
              {/* <UserMenu /> */}
              <SwitcherGroup show={showItems} />
              <Link to="/user/me" className="px-2">{user.name}</Link>
              <logoutClient.Form method="post" action="/user/logout" className="inline">
                <input type="hidden" value={pathname} name="next" />
                <Button type="submit" _type="plain">Logout</Button>
              </logoutClient.Form>
            </div>
            :
            <div className="text-sm font-light flex">
              <SwitcherGroup show={showItems} />
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
  const { transition } = useUI()
  const position = transition === 'idle' ? '-right-80' : 'right-3'
  return (
    <div className={`fixed top-3 ${position} font-light ease-in-out duration-500`}>
      <div className="flex gap-3 shadow-lg rounded bg-blue-600/90 justify-center text-white p-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <label className="capitalize">{transition}...</label>
      </div>
    </div>
  )
}

const SwitcherGroup = ({ show }) => {
  const { view, theme } = show
  return (
    <div className="2xs:hidden xs:hidden sm:hidden md:hidden lg:flex xl:flex 2xl:flex justify-between gap-3 mr-8">
      {
        view && <ViewSwither />
      }
      {
        theme && <ThemeSwither />
      }
    </div>
  )
}

const ViewSwither = () => {
  // const view = useAppearanceStore(s => s.view)
  // const changeView = useAppearanceState(s => s.changeView)
  const { view } = useAppearance()

  const gridDisplay = view === 'grid' ? 'hidden' : 'inline'
  const listDisplay = view === 'list' ? 'hidden' : 'inline'

  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        onClick={event => appearanceState.changeView("grid")}
        className={`w-6 h-6 ${gridDisplay} cursor-pointer`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        onClick={event => appearanceState.changeView("list")}
        className={`w-6 h-6 ${listDisplay} cursor-pointer`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>
  )
}

const ThemeSwither = ({ showLabel = false }) => {
  // const theme = useAppearanceStore(s => s.theme)
  // const changeTheme = useAppearanceState(s => s.changeTheme)
  const { theme } = useAppearance()
  // const pos = theme === 'light' ? 'left-1' : 'left-2/4'
  // const toggle = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   appearanceState.changeTheme(newTheme)
  // }
  const moonDisplay = theme === "dark" ? "hidden" : "inline"
  const sunDisplay = theme === "light" ? "hidden" : "inline"

  const other = theme === "dark" ? "light" : "dark"
  return (
    <div className="flex items-end gap-1" title={`Switch to ${other}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className={`w-6 h-6 ${sunDisplay} cursor-pointer`}
        onClick={event => appearanceState.changeTheme("light")}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className={`w-6 h-6 ${moonDisplay} cursor-pointer`}
        onClick={event => appearanceState.changeTheme("dark")}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>

      {
        showLabel && <label>{theme.toUpperCase()}</label>
      }
    </div>
    // <div className="mr-10 relative border border-slate-0 rounded-3xl px-1 py-0.5 w-30 flex justify-between cursor-pointer"
    //   onClick={e => toggle()}>
    //   <label className="pr-3">☀️</label>
    //   <label>🌙</label>
    //   <span className={`absolute ${pos} w-5 h-5 border border-slate-200 bg-slate-300 opacity-100 rounded-full ease-linear duration-100 transition-all`}></span>
    // </div>
  )
}

const Avatar = (props) => {
  const user = useCurrent()
  return (
    <div {...props} className="relative w-11 h-11 flex justify-center items-center rounded-full bg-blue-500 text-white cursor-pointer shadow-lg hover:bg-blue-800 ease-in-out duration-300">
      {
        user.avatar ?
          <img src={user.avatar} /> :
          <label className="font-bold text-lg cursor-pointer">{user.name[0]}</label>
      }
    </div>
  )
}

const UserMenu = () => {
  const { modal } = useUI()
  const { theme } = useAppearance()
  const display = modal.avatar ? "block" : "hidden"
  const color = theme === "light" ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"
  const toggle = event => {
    uiState.modal.avatar = !modal.avatar
    event.stopPropagation()
  }
  return (
    <div className="fixed z-40 mr-32">
      <Avatar onClick={toggle} />
      <div className={`${display} ${color} border rounded-lg shadow-md p-4 flex flex-col gap-3 w-52 relative -left-40`} onClick={event => event.stopPropagation()}>
        <section>111</section>
        <section>222</section>
        <ViewSwither />
        <ThemeSwither />
      </div>
    </div>
  )
}