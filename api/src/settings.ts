import { AppSettings } from '../deps.ts'
import { PostArea } from './areas/post/post.area.ts'
import { Log } from './middlewares/log.middleware.ts'
import { TagArea } from './areas/tag/tag.area.ts'
import { CategoryArea } from './areas/category/category.area.ts'

export const appSettings: AppSettings = {
  areas: [PostArea, CategoryArea, TagArea],
  middlewares: [Log],
  logging: true
}
