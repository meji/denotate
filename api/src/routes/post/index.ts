import { getPost } from '../../controllers/posts.ts'
import { Router } from '../../../deps.ts'
export const postRouter = new Router()
postRouter.get('/posts', getPost)
