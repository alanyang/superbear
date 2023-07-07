import { Link } from "@remix-run/react"

const COLORS = [
  'bg-yellow-600', 'bg-lime-600', 'bg-emerald-600', 'bg-teal-600',
  'bg-cyan-600', 'bg-blue-600', 'bg-indigo-600', 'bg-violet-600',
  'bg-purple-600', 'bg-pink-600', 'bg-rose-600',
  'bg-orange-600', 'bg-lime-600', 'bg-sky-600',
  'bg-fuchsia-600', 'bg-zinc-600', 'bg-red-600', 'bg-amber-600',
  'bg-green-600', 'bg-sky-600', 'bg-fuchsia-600', 'bg-stone-600',
  'bg-gray-600', 'bg-neutral-600', 'bg-stone-600', 'bg-orange-600',
]

export const tagColor = name => COLORS[(name[0].charCodeAt()) % COLORS.length]

export default ({ id, name }) => {
  const color = tagColor(name)
  return (
    <Link to={`/tag/${id}`} className={`rounded ${color} text-white font-thin text-sm px-1.5`}>#{name}</Link>
  )
}