const koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const app = new koa()

// x-response-time
app.use(async(ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

//logger
app.use(async(ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// add router url
router.get('/', async(ctx, next) => {
  ctx.body = `<h1>this is a test</h1>`
})
router.get('/hello/:name', async (ctx, next) => {
  const name = ctx.params.name
  ctx.response.body = `<h1>hello, ${name}!</h1>`
})

router.get('/index', async (ctx, next) => {
  ctx.response.body = `<h1>this is Index</h1>`
})

router.param('user', (id, ctx, next) => {
  ctx.user = users[id]
  if (!ctx.user) return ctx.status = 404
  return next()
  })

// response
app.use(router.routes()).use(router.allowedMethods());

app.listen(5000)

