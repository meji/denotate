import { Application, Router } from '../deps.ts'
import posts from './routes/posts.ts'

export const app = new Application()
const router = new Router()

router.get('/', ctx => {
  ctx.response.body = 'Hola index'
})
app.use(router.routes()).use(posts.routes())
app.use(router.allowedMethods())
