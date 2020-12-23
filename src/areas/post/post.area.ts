import { Area } from '../../../deps.ts'
import { PostController } from './post.controller.ts'

@Area({
  baseRoute: '/posts',
  controllers: [PostController]
})
export class PostArea {}
