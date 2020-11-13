import { Application, Router } from '../deps.ts'
import { indexRouter } from './routes/index.ts'
import { postRouter } from './routes/post/index.ts'

const router = new Router()
export const app = new Application()
app.use(indexRouter.routes())
app.use(postRouter.routes())
app.use(router.routes())
app.use(router.allowedMethods())
