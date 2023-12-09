const express = require('express')
const cors = require('cors')


//  用户 注册登录 接口路由
const userRouter = require('./router/user')

//  用户 申请增加改查日志 接口路由
const messionRouter = require('./router/mession')

const app = express()

// 使用 cors 中间件
app.use(cors({
    origin:'http://localhost:5173',// 允许请求的域名
    methods: ['GET', 'POST'], // 允许的请求方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    credentials: true, // 是否允许发送身份验证凭据（如Cookie）
    maxAge: 86400, // 预检请求的有效期，单位为秒
}))

// 解析数据
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// 中间件使用 用户 注册和登录 路由
app.use('/user',userRouter)
app.use('/mes',messionRouter)

// 测试接口
app.get('/',(req,res)=>{
    res.send('Hello world!')
})

 
app.listen(3000,()=>{
    console.log('server is running at http://127.0.0.1:3000')
})