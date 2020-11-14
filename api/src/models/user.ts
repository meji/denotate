import { ObjectID } from './id.ts'

export interface User {
  login: string
  password: string
  email: string
  firstName: string
  lastName: string
}

export type UserDocument = ObjectID & User
