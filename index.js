import Koa from 'koa'
import { Login } from './script/login.js'

const app = new Koa()
const appLoggin = new Login()
// logger

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now()
  const res = await appLoggin.getUpvoteURL('45653143')
  await next()
  console.log(res)
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// response

app.use(async (ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000)
