import { ObjectID } from './id.ts'

export interface Category {
  title: string
  brief: string
  description: string
  img: string
  posts: ObjectID[]
}

export type CategoryDoc = ObjectID & Category
