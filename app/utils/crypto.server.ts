import { createHash } from 'node:crypto'

const passwordSalt = '88@_*312^_^3M?na*'
export const cryptoPassword = password => createHash('sha256').update(`${passwordSalt}${password}${passwordSalt}`).digest('hex')