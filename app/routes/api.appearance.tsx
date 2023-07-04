import { ActionArgs, json } from "@remix-run/node";
import { themeCookie, viewCookie } from "../cookie"

const views = ['grid', 'list']
const themes = ['light', 'dark']
const actions = ['changeView', 'changeTheme']

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData()
  const { view, theme, _action } = Object.fromEntries(data)
  if (!actions.includes(_action as string)) return json({ ok: 0, reason: 'invalid action' })

  switch (_action) {
    case 'changeTheme':
      if (!themes.includes(theme as string)) return json({ ok: 0, reason: 'invalid theme' })
      return json({ ok: 1 }, { headers: { "Set-Cookie": await themeCookie.serialize(theme) } })
    case 'changeView':
      if (!views.includes(view as string)) return json({ ok: 0, reason: 'invalid view' })

      return json({ ok: 1 }, { headers: { "Set-Cookie": await viewCookie.serialize(view) } })
  }
}
