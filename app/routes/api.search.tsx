import { json, type LoaderArgs } from "@remix-run/node"
import { prisma } from "~/utils/db.server"

export const loader = async ({ request }: LoaderArgs) => {
  const url: URL = new URL(request.url)
  console.log(url.searchParams)
  if (!url.searchParams.has('s')) {
    return json({ ok: 0, reason: 'empty keyword' })
  }
  let search: Array<String> | String = url.searchParams.get('s').split(' ').filter(it => !!it)

  search = search.length > 1 ?  `(${search.join(' | ')})`: search[0]
  console.log(search)

  try {
    const posts = await prisma.post.findMany({
      where: { title: { search: search as string }, content: { search: search as string } },
      select: {
        id: true, title: true, content: true, createAt: true, author: {
          select: { id: true, name: true }
        }
      }
    })
    return json({ ok: 1, posts })
  } catch (err) {
    console.log(err)
    return json({ ok: 0, reason: 'database error' })
  }
}