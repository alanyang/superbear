import { LoaderArgs, type LinksFunction, json, V2_MetaFunction } from "@remix-run/node"
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

import css from '~/global.css'
import { themeCookie, viewCookie } from "./cookie";
import { userLoader } from "./utils/loader.server";
import { useState } from "react";
import { AppearanceContext, UserContext } from "./utils/context";
import Header from "./views/Header";

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: css }
];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Superbear discuss" },
    { name: "Superbear discuss", content: "Discuss any issues freely and openly" },
  ];
};

export const loader = async (args: LoaderArgs) => {
  const { request } = args
  const cookieHeader = request.headers.get('Cookie')
  const theme = (await themeCookie.parse(cookieHeader)) || 'light'
  const view = (await viewCookie.parse(cookieHeader)) || 'grid'
  const { user } = await userLoader(args)
  return json({ theme, view, user, env: process.env.NODE_ENV })
}

export default function App() {
  const { user, env, ...data } = useLoaderData()
  const [theme, setTheme] = useState(data.theme)
  const [view, setView] = useState(data.view)

  const color = theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-200'

  const fetcher = useFetcher()
  const changeTheme = theme => {
    setTheme(theme)
    fetcher.submit({ theme, _action: 'changeTheme' }, { method: 'post', action: '/api/appearance' })
  }

  const changeView = view => {
    setView(view)
    fetcher.submit({ view, _action: 'changeView' }, { method: 'post', action: '/api/appearance' })
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
          <body className={`no-scrollbar w-full min-h-full ease-in-out duration-300 ${color}`}>
            <main className="h-full">
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
