import { indexController } from '../controllers/index.ts'
import { Router } from '../../deps.ts'
export const indexRouter = new Router()
indexRouter.get('/', indexController)
