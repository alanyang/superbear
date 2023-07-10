import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "ss",

        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),

        //mean use ajax fetch not cookie, bad idea
        // httpOnly: true, 
        maxAge: 60 * 24 * 30,
        // path: "/",
        sameSite: "lax",
        secrets: ["&M3?e@_^~~991"],
        // secure: true,
      },
    }
  );

export const getCurrentUser = async request => {
  const session = await getSession(request.headers.get('Cookie'))
  //@ts-ignore
  return session.has('user') && JSON.parse(session.get('user')) || null
}
export { getSession, commitSession, destroySession };
