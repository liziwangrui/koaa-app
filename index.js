const koa = require('koa')
// const router = require('koa-router')()
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

/**
 * 用Promise封装异步读取文件方法
 * @param {string} page  page html文件名
 * @return {promise}
 */
function render(page) {
  return new Promise((resolve, reject) => {
    let viewUrl = `./view/${page}`
    // 读取文件
    fs.readFile(viewUrl, 'binary', (error , data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * 根据 url 返回相应的 html
 * @param {string} url 
 * @return string
 */
async function router (url) {
  let view = '404.html'
  switch(url) {
    case '/':
      view = 'index.html'
      break;
    case '/index':
      view = 'index.html'
      break;
    case '/404':
      view = '404.html'
      break;
    default:
      break;
  }
  let html = await render(view)
  return html
}

// response
app.use(async ctx => {
  let url = ctx.request.url
  let html = await router(url)
  ctx.body = html
})

app.listen(5000)
