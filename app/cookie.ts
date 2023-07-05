import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const themeCookie = createCookie("theme", {
  maxAge: 604_800 * 4, // 4 week
})