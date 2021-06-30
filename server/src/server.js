const express = require('express')
const cors = require('cors');

const controller = require('./controller')
const app = express()

app.use(express.json())

const corsMiddleware = cors({credentials:true,origin:['*','http://localhost:3000'],methods:['GET','POST','PUT']})

app.use(corsMiddleware)
app.use('/content',express.static(__dirname+'/uploads'));
app.use('/api',controller)



module.exports = app