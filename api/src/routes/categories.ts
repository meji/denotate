import {
  addCategory,
  getCategory,
  getCategoryById,
  getAllPosts
} from '../controllers/categories.ts'
import { Router } from '../../deps.ts'
const router = new Router()
router.get('/categories', getCategory)
router.get('/categories/:id', getCategoryById)
router.get('/categories/getPosts/:id', getAllPosts)
router.post('/categories/add', addCategory)
export default router
