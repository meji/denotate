import { db } from '../connection.ts'

export interface PostSchema {
  _id: { $oid: string }
  title: string
  brief: string
  description: string
  type: number
}

export const Posts = db.collection<PostSchema>('posts')
