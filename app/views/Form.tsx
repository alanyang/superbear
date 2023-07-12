import { useAppearanceStore } from "~/utils/store"

const colors = {
  dark: 'bg-slate-800 text-slate-100',

  light: 'bg-slate-100 text-slate-800'
}

export const Input = props => {
  const appearance = useAppearanceStore()
  const color = colors[appearance.theme]
  return (
    <input {...props} className={`${color} border-blue-500 border m-1 p-2 rounded hover:border-blue-300 focus:border-blue-200 focus:outline-none`} autoComplete="new-password"/>
  )
}

export const TextArea = props => {
  const appearance = useAppearanceStore()
  return (
    <textarea {...props} className={`${colors[appearance.theme]} border-blue-500 border m-1 p-2 rounded hover:border-blue-300 focus:border-blue-200 focus:outline-none`} />
  )
}

export const Button = props => {
  const { _type, _size, ...other } = props

  let size = 'px-7 py-1 font-normal text-base'
  switch (_size) {
    case 'tiny':
      size = 'px-1 py-0 font-thin text-xs'
      break
    case 'small':
      size = 'px-2 py-0.5 font-extralight text-sm'
      break
    case 'medium': break
    case 'large':
      size = 'px-9 py-2 font-semibold text-lg'
      break
    case 'extralarge':
      size = 'px-12 py-3 font-bold text-xl'
      break
    case 'full':
      size = 'font-normal py-1 font-light text-base w-full'
      break
  }

  const anim = 'duration-500 ease-in-out'

  switch (_type) {
    case 'danger':
      return <button {...other} className={`bg-red-500 ${size} rounded hover:bg-red-800 text-white ${anim}`}>{other.children}</button>
    case 'warning':
      return <button {...other} className={`bg-orange-500 ${size} rounded hover:bg-orange-800 text-white ${anim}`}>{other.children}</button>
    case 'sucess':
      return <button {...other} className={`bg-green-500 ${size} rounded hover:bg-green-800 text-white ${anim}`}>{other.children}</button>
    case 'info':
      return <button {...other} className={`bg-slate-500 ${size} rounded hover:bg-slate-800 text-white ${anim}`}>{other.children}</button>
    case 'primary':
      return <button {...other} className={`bg-blue-500 ${size} rounded hover:bg-blue-800 text-white ${anim}`}>{other.children}</button>
    case 'plain':
      return <button {...other} className="hover:border-slate-400 border rounded-sm border-slate-200 px-2 font-extralight">{other.children}</button>
    default:
      return <button {...other} className={`bg-gray-500 ${size} rounded hover:bg-gray-800 text-white ${anim}`}>{other.children}</button>
  }
}