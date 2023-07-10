import { json, type LoaderArgs, type ActionArgs } from "@remix-run/node"
import { cryptoPassword } from "~/utils/crypto.server"
import { prisma } from "~/utils/db.server"
import { userLoader } from "~/utils/loader.server"
import { UpdateUserValidor } from "~/utils/validator"

export async function loader (args: LoaderArgs) {
  const { user } = await userLoader(args)
  return json({ ok: 1, user })
}

export async function action (args: ActionArgs) {
  const { request } = args
  const { user } = await userLoader(args)
  if (!user) return json({ ok: 0, reason: 'unauth user' })
  const form = await request.formData()
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
      //@ts-ignore
      if (name) newData.name = name
      //@ts-ignore
      if (password) newData.password = cryptoPassword(password)
      await prisma.user.update({ where: { id: user.id }, data: newData })
      return json({ ok: 1 })
  }
  return json({ ok: 0 })
}