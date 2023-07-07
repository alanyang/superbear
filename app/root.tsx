//@ts-nocheck
import { ActionArgs, json, type LinksFunction, type LoaderArgs } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useState } from "react";

import tailwind from '~/tailwind.css'
import { themeCookie, viewCookie } from "./cookie"
import { AppearanceContext, UserContext } from "~/utils/context"
import { userLoader } from "./utils/loader.server";
import Header from "./views/Header";

const invalidViews = ['grid', 'list']
const invalidTheme = ['light', 'dark']

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind }
];

export const loader = async ({ request, context }: LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const theme = (await themeCookie.parse(cookieHeader)) || 'light'
  const view = (await viewCookie.parse(cookieHeader)) || 'grid'
  const { user } = await userLoader({ request, context })
  return json({ theme, view, user })
}

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData()
  const { theme, view, _action } = Object.fromEntries(data)
  switch (_action) {
    case 'changeTheme':
      if (invalidTheme.includes(theme))
        return json({ ok: 0 }, { headers: { "Set-Cookie": await themeCookie.serialize(theme) } })
    case 'changeView':
      if (invalidViews.includes(view))
        return json({ ok: 0 }, { headers: { "Set-Cookie": await viewCookie.serialize(view) } })
  }

}

export default function App() {
  const { user, ...data } = useLoaderData()
  const [theme, setTheme] = useState(data.theme)
  const [view, setView] = useState(data.view)

  const color = theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'

  const fetcher = useFetcher()
  const changeTheme = theme => {
    setTheme(theme)
    fetcher.submit({ theme, _action: 'changeTheme' }, { method: 'post' })
  }

  const changeView = view => {
    setView(view)
    fetcher.submit({ view, _action: 'changeView' }, { method: 'post' })
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <AppearanceContext.Provider value={{ theme, changeTheme, view, changeView }}>
        <UserContext.Provider value={{ user }}>
          <body className={`${color} no-scrollbar`}>
            <main className={`px-8 py-5 w-full h-full ease-in-out duration-200`}>
              <Header user={user} showSwither={{ view: true, theme: true }} />
              <Outlet />
            </main>
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </UserContext.Provider>
      </AppearanceContext.Provider>

    </html>
  );
}
