import { createHash } from 'node:crypto'

const salt = '88@_*312^_^3M?na*'
export const cryptoPassword = password => createHash('sha256').update(`${salt}${password}${salt}`).digest('hex')