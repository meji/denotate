import { db } from '../connection.ts'

export interface CategorieSchema {
  _id: { $oid: string }
  title: string
  brief: string
  description: string
  posts: { $oid: string }[]
}

export const Categories = db.collection<CategorieSchema>('categories')
