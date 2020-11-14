import { AppSettings } from '../deps.ts'
import { PostArea } from './areas/post/post.area.ts'
import { Log } from './middlewares/log.middleware.ts'

export const appSettings: AppSettings = {
  areas: [PostArea],
  middlewares: [Log],
  logging: true
}
