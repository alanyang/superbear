import { createCookie } from "@remix-run/node"; // or cloudflare/deno

const maxAge = 604_800 * 4

export const themeCookie = createCookie("theme", { maxAge })

export const viewCookie = createCookie('view', { maxAge })