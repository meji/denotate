import { AppSettings } from '../deps.ts'
import { PostArea } from './areas/post/post.area.ts'
import { Log } from './middlewares/log.middleware.ts'
import { TagArea } from './areas/tag/tag.area.ts'
import { CategoryArea } from './areas/category/category.area.ts'
import { UserArea } from './areas/user/user.area.ts'

export const appSettings: AppSettings = {
  areas: [PostArea, CategoryArea, TagArea, UserArea],
  middlewares: [Log],
  logging: true
}
