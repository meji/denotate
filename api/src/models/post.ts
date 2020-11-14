import { User } from './user.ts'
import { ObjectID } from './id.ts'

export interface Post {
  title: string
  brief: string
  description: string
  img: string
  author: User
  cat: ObjectID
  tags: ObjectID[]
}

export type PostDoc = ObjectID & Post
