import { Application, Router, isHttpError } from '../deps.ts'
import 'https://deno.land/x/dotenv/load.ts'
import posts from './routes/posts.ts'
import categories from './routes/categories.ts'

export const app = new Application()
const router = new Router()

router.get('/', ctx => {
  ctx.response.body = 'Hola index'
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case 404:
          ctx.response.status = 404
          ctx.response.body = { msg: 'Requested resource can not be found' }
          break
        default:
          ctx.response.status = 400
          ctx.response.body = { msg: 'Request can not be processed currently' }
      }
    } else {
      ctx.response.status = 500
      ctx.response.body = { msg: 'Something went wrong' }
    }
  }
})

app
  .use(router.routes())
  .use(posts.routes())
  .use(categories.routes())
app
  .use(router.allowedMethods())
  .use(posts.allowedMethods())
  .use(categories.allowedMethods())
