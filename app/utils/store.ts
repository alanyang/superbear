import { proxy, subscribe, useSnapshot } from "valtio"

export const keyPrefix = "___superbear"

/**
 * useSnapshot scope triggle re-render, just read
 * state.xxx = xxx scope on react component out, just write
 * useProxy include both, auto ensure by scope
 */

type AppearanceState = {
  theme: "dark" | "light" | "system"
  view: "list" | "grid"
}

interface AppearanceAction {
  changeTheme: (theme: AppearanceState["theme"]) => (AppearanceState & AppearanceAction)
  changeView: (view: AppearanceState["view"]) => (AppearanceState & AppearanceAction)
}


type UIState = {
  transition: "idle" | "submitting" | "loading"
  modal: { avatar: boolean }
}

interface UIAction {
  setTransition: (ts: UIState["transition"]) => (UIState & UIAction)
  hiddenModal: () => (UIState & UIAction)
}

export const appearanceState = proxy<AppearanceState & AppearanceAction>({
  theme: "light",
  view: "grid",
  changeTheme: theme => {
    appearanceState.theme = theme
    return appearanceState
  },
  changeView: view => {
    appearanceState.view = view
    return appearanceState
  }
})

//return unsubscribe function, don't use it
//persist when state changed
const _ = subscribe(appearanceState, () => {
  localStorage.setItem(`${keyPrefix}_appearance`, JSON.stringify({ theme: appearanceState.theme, view: appearanceState.view }))
})
//export
export const useAppearance = (): (AppearanceAction & AppearanceState) => useSnapshot(appearanceState)

export const uiState = proxy<UIState & UIAction>({
  transition: "idle",
  modal: { avatar: false },
  setTransition: (transition) => {
    uiState.transition = transition
    return uiState
  },
  hiddenModal: () => {
    Object.keys(uiState.modal).forEach(key => {
      uiState.modal[key] = false
    })
    return uiState
  }
})
//export
export const useUI = (): (UIState & UIAction) => useSnapshot(uiState)


export type User = {
  id: string,
  email: string,
  name?: string
  avatar?: string
}

interface CurrentUser {
  user?: User
  setUser: (user: User) => void
  changeName: (name: string) => void
  changeAvatar: (avatar: string) => void
}

export const currentUser = proxy<CurrentUser>({
  user: null,
  setUser: (user: User) => {
    currentUser.user = user
  },
  changeName: (name: string) => {
    currentUser.user.name = name
  },
  changeAvatar: (avatar: string) => {
    currentUser.user.avatar = avatar
  }
})

export const useCurrent = (): User => useSnapshot(currentUser).user