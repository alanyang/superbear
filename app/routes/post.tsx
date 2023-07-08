//@ts-nocheck
import { Outlet } from "@remix-run/react"

export default () => {
  return (
    <div className="px-4 py-2">
      <Outlet />
    </div>
  )
}