import { ObjectID } from './id.ts'

export interface Token {
  header: string
  payload: string
  signature: string
  exp: number
}

export type TokenDocument = ObjectID & Token
