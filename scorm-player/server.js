const express = require('express')
const next = require('next')
const port = 3000
const dev = true
const app = next({
    dir: '.', 
    dev,
})
const handle = app.getRequestHandler()
let server
app
  .prepare()
  .then(() => {
    server = express()
    const {createProxyMiddleware}  = require('http-proxy-middleware')
      
    server.use('/content', createProxyMiddleware({
        target: 'http://localhost:5050',
        pathRewrite: { '^/content': '/content' },
        changeOrigin: true,
    }))

    server.all('*', (req, res) => handle(req, res))

    server.listen(port, (err) => {
      if (err) {
        throw err
      }
      console.log(`> Ready on port ${port} `)
    })
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })