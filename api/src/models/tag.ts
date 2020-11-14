import { Post } from './post.ts'
import { ObjectID } from './id.ts'

export interface Tag {
  title: string
  brief: string
  description: string
  img: string
  posts: Post[]
}

export type TagDoc = ObjectID & Tag
