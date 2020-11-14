import { Application, Router } from '../deps.ts'
import posts from './routes/posts.ts'
import categories from './routes/categories.ts'

export const app = new Application()
const router = new Router()

router.get('/', ctx => {
  ctx.response.body = 'Hola index'
})
app
  .use(router.routes())
  .use(posts.routes())
  .use(categories.routes())
app.use(router.allowedMethods())
