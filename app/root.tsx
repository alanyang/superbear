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
import { userLoader } from "./utils/loader.server";
import { useEffect } from "react";
import Header from "./views/Header";
import { useAppearance, useCurrent, useStore } from "./utils/store";

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

export const loader = userLoader

export default function App () {
  const { user } = useLoaderData()

  const theme = useStore(useAppearance, state => state.theme)

  const color = theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-200'

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
        <body className={`no-scrollbar w-full min-h-full ease-in-out duration-300 ${color}`}>
          <main className="h-full">
            <Header user={user} showSwither={{ view: true, theme: true }} />
            <Outlet />
          </main>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>

    </html >
  );
}