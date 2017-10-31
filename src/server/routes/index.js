const { join: pathJoin } = require('path')
const Router = require('koa-router')
const serveStatic = require('koa-static')

module.exports = ({ app, middleware }) => {
  const router = new Router({
    prefix: '/'
  })

  app.use(serveStatic(pathJoin(__dirname, '../../../dist')))
  app.use(serveStatic(pathJoin(__dirname, '../../../temp')))
  app.use(router.routes())
  app.use(router.allowedMethods())
}
