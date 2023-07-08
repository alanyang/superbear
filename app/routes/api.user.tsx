//@ts-nocheck
import { json, type LoaderArgs, type ActionArgs } from "@remix-run/node"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"
import { userLoader } from "~/utils/loader.server"
import { UpdateUserValidor } from "~/utils/validtor"

export async function loader({ request, context }: LoaderArgs) {
  const { user } = await userLoader({ request, context })
  return json({ ok: 1, user })
}

export async function action({ request, context }: ActionArgs) {
  const { user } = await userLoader({ request, context })
  if (!user) return json({ ok: 0, reason: 'unauth user' })
  const form = await request.formData()
  console.log(request.method)
  switch (request.method) {
    case 'PUT':
      const result = await UpdateUserValidor.validate(form)
      if (result.error) {
        return json({
          ok: 0,
          reason: Object.entries(result.error.fieldErrors).map(([field, err]) => `<div>${field.toUpperCase()}:${err}</div>`).join('')
        })
      }
      const { name, password } = result.data
      const newData = {}
      if (name) newData.name = name
      if (password) newData.password = cryptoPassword(password)
      await prisma.user.update({ where: { id: user.id }, data: newData })
      return json({ ok: 1 })
  }
  return json({ ok: 0 })
}