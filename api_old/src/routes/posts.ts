import { addPost, getPost, getPostById } from '../controllers/posts.ts'
import { Router } from '../../deps.ts'
const router = new Router()
router.get('/posts', getPost)
router.get('/posts/:id', getPostById)
router.post('/posts/add', addPost)
export default router
