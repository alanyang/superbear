import { Outlet } from "@remix-run/react"
import Header from "~/views/Header"

export default () => {
  return (
    <div>
      <Header showItems={{ view: false, theme: true }} />
      <div className="px-4 py-2">
        <Outlet />
      </div>
    </div>

  )
}