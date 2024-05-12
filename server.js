const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

// 引入路由users
const users = require('./routes/users')
const manages = require('./routes/manage')
const fruites = require('./routes/fruit')
const order_forms = require('./routes/order_form')


//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/fruit_shopping')
mongoose.connection.on('open', () => {
    console.log('连ok');
})

mongoose.connection.on('error', () => {
    console.log('连接失败')
})


app.get('/test', (req, res) => {
    res.end('hello express')
})
app.use("/users", users)
app.use("/manages", manages)
app.use('/fruits', fruites)
app.use('/order_form', order_forms)

app.use('/uploads', express.static('uploads'));

app.listen(8000, () => {
    console.log('服务器已经开启');
})