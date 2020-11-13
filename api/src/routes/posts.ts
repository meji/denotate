import { getPost } from '../controllers/posts.ts'
import { Router } from '../../deps.ts'
const router = new Router()
router.get('/posts', getPost)
export default router
