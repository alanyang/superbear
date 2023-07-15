//@ts-nocheck
import { create } from "zustand"
import { useEffect, useState } from "react"
import { persist } from "zustand/middleware"
import { produce } from "immer"

type AppearanceState = {
  theme: "dark" | "light" | "system"
  view: "list" | "grid"
}

interface AppearanceAction {
  changeTheme: (theme: AppearanceState["theme"]) => (AppearanceState & AppearanceAction)
  changeView: (view: AppearanceState["view"]) => (AppearanceState & AppearanceAction)
}

export const useAppearanceState = create<AppearanceState & AppearanceAction>()(
  persist(
    (set, get) => ({
      theme: "light",
      view: "grid",
      changeTheme: theme => {
        set({ theme, view: get().view })
        return get()
      },
      changeView: view => {
        set({ view, theme: get().theme })
        return get()
      }
    }),
    { name: "__superbear_appearance" }
  )
)

useAppearanceState.subscribe((state, prev) => console.log(state))

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

export type User = {
  id: string,
  email: string,
  name?: string
  avatar?: string
}

interface CurrentState {
  user?: User
  setUser: (user: User) => void
  changeName: (name: string) => void
  changeAvatar: (avatar: string) => void
}

export const useCurrent = create<CurrentState>()(
  (set, get) => ({
    user: null,
    setUser: user => set({ user }),
    changeName: name => set(produce(state => { state.user.name = name })),
    changeAvatar: avatar => set(produce(state => { state.user.avatar = avatar }))
  })
)

export const useStore = <T, F> (
  store: (selector: (state: T) => unknown) => unknown,
  selector: (state: T) => F
) => {
  const result = store(selector) as F
  const [state, setState] = useState<F>()
  useEffect(() => setState(result), [result])
  return state
}

export const useAppearanceStore = <R> (selector: (state: AppearanceState & AppearanceAction) => R) => useStore(useAppearanceState, selector)
