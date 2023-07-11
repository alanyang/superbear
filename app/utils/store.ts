import { create } from "zustand"
import { useEffect, useState } from "react"
import { persist } from "zustand/middleware"

interface Appearance {
  theme: "dark" | "light" | "system"
  view: "list" | "grid"
  changeTheme: (theme: Appearance["theme"]) => void
  changeView: (view: Appearance["view"]) => void
}

export const useAppearance = create<Appearance>()(
  persist(
    (set, get) => ({
      theme: "light",
      view: "grid",
      changeTheme: theme => set({ theme, view: get().view }),
      changeView: view => set({ view, theme: get().theme }),
    }),
    { name: "superbear-appearance" }
  )
)

interface UIState {
  transition: "idle" | "submitting" | "loading"
  modal: boolean
  setTransition: (ts: UIState["transition"]) => void
  toggleModal: () => void
}
export const useUIState = create<UIState>()(
  (set, get) => ({
    transition: "idle",
    modal: false,
    setTransition: transition => set({ transition, modal: get().modal }),
    toggleModal: () => set({ transition: get().transition, modal: !get().modal })
  })
)


export const useStore = <T, F> (
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  const [state, setState] = useState<F>()

  useEffect(() => setState(result), [result])

  return state
}