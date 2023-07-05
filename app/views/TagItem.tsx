import { Link } from "@remix-run/react"
import * as _ from 'lodash'

const COLORS = ['bg-orange-600', 'bg-lime-600', 'bg-sky-600', 'bg-fuchsia-600', 'bg-zinc-600', 'bg-red-600', 'bg-amber-600', 'bg-green-600', 'bg-sky-600', 'bg-fuchsia-600']

export default ({ id, name, index }) => {
  const colors = _.shuffle(COLORS)
  const color = colors[index % COLORS.length]
  return (
    <Link to={`/tag/${id}`} className={`rounded ${color} text-white font-thin text-sm px-1.5`}>{name}</Link>
  )
}