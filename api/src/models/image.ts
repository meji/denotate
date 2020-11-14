import { ObjectID } from './id.ts'

export interface Image {
  name: string
  title?: string
  description?: string
  url?: string
  data?: File
  extension: string
}

export type ImageDoc = ObjectID & Image
