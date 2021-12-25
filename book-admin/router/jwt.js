const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

const jwtAuth = expressJwt({
    secret: PRIVATE_KEY,
    algorithms: ['HS256'],
    credentialsRequired: true // false不进行校验
}).unless({
    path: ['/', '/user/login'] // 设置 jwt 认证 白名单
})

module.exports = jwtAuth