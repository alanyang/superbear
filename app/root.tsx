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
import { themeCookie } from "./cookie"
import ThemeContext from "~/utils/theme"

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind }
];

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const theme = (await themeCookie.parse(cookieHeader)) || 'light'
  return json({ theme })
}

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData()
  const { theme } = Object.fromEntries(data)
  return json({ ok: 0 }, { headers: { "Set-Cookie": await themeCookie.serialize(theme) } })
}

export default function App() {
  const data = useLoaderData()
  console.log(data, 'loader')
  const [theme, setTheme] = useState(data.theme)
  console.log(theme)
  const color = theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-300'

  const fetcher = useFetcher()
  const changeTheme = theme => {
    setTheme(theme)
    fetcher.submit({ theme }, { method: 'post' })
  }
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
        <body className={color}>
          <main className={`px-8 py-5 w-full h-full ease-in duration-300`}>
            <Outlet />
          </main>

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </ThemeContext.Provider>

    </html>
  );
}
