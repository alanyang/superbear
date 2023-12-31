import { type LinksFunction, V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData
} from "@remix-run/react";

import css from '~/global.css';
import { loadUser } from "./utils/loader.server";
import Header from "./views/Header";
import { appearanceState, currentUser, keyPrefix, uiState, useAppearance, useCurrent } from "./utils/store";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";


export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: css }
];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Superbear discuss" },
    { name: "Superbear discuss", content: "Discuss any issues freely and openly" },
    { viewport: "width=device-width,initial-scale=1" },
  ];
};

export const loader = loadUser

export default function App () {
  const { user } = useLoaderData()
  // const theme = useAppearanceStore(state => state.theme)
  // const [setUser, changeName] = useCurrent(state => [state.setUser, state.changeName], shallow)
  const { theme, changeTheme } = useAppearance()
  currentUser.setUser(user)

  const color = theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-200'

  let i = 1
  useEffect(() => {
    const data = localStorage.getItem(`${keyPrefix}_appearance`)
    if (data) {
      const { theme, view } = JSON.parse(data)
      changeTheme(theme).changeView(view)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={`no-scrollbar w-full min-h-full ease-in-out duration-300 ${color}`} onClick={uiState.hiddenModal}>
        <main className="h-full">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>

    </html >
  );
}