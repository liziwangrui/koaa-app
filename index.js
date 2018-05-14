const koa = require('koa')
const Router = require('koa-router')
const app = new koa()
const router = new Router()
const fs = require('fs')
const bodyParser = require('koa-bodyparser')

// middleware是有顺序的，所以要在 router 使用之前注册到 app 上
app.use(bodyParser())

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

// add router url 造一个简单的登陆表单
router.get('/', async(ctx, next) => {
  ctx.response.body = `<h1>this is a test123</h1>`
})

router.get('/hello/:name', async (ctx, next) => {
  const name = ctx.params.name
  ctx.response.body = `<h1>hello, ${name}!</h1>`
})

router.get('/index', async (ctx, next) => {
  ctx.response.body = `<h1>this is Index</h1>`
})

app.use(async(ctx, next) => {
  // 直接从上下文中获 get 请求参数ctx.query
  const url = ctx.url
  // 返回格式化好的一个对象
  const ctx_query = ctx.query
  // 返回字符串
  const ctx_queryStr = ctx.querystring

  // 从上下文的 request 对象中获取请求的参数
  const req_query = ctx.request.query
  const req_queryStr = ctx.request.querystring
  ctx.body = {
    url,
    ctx_query,
    ctx_queryStr,
    req_query,
    req_queryStr
  }
  console.log(ctx.body, 'ctx.body')
  await next()
})


// response
app.use(router.routes()).use(router.allowedMethods());

app.listen(5000)

