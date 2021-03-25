const express = require('express')
const Result = require('../modules/result')
const {login, findUser} = require('../services/user')
const router = express.Router()
const {md5, decoded} = require('../utils/index')
const {PWD_SALT, PRIVATE_KEY, JWT_EXPIRED} = require('../utils/constant')
const {body, validationResult} = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')

router.get('/info', function (req, res, next) {
  const decode = decoded(req) // 解析token
  if (decode && decode.username) {
    findUser(decode.username).then(user => {

      if (user) {
        user.roles = [user.role]
        new Result(user, '用户查询成功').success(res)
      } else {
        new Result('用户查询失败').fail(res)
      }
    })
  } else {
    new Result('用户查询失败').fail(res)
  }

})

router.post('/login', [
  body('username').isString().withMessage('用户名必须为字符串'),
  body('password').isString().withMessage('密码必须为字符串'),
], function (req, res, next) {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    const [{msg}] = err.errors
    next(boom.badRequest(msg))
  } else {
    let {username, password} = req.body
    password = md5(`${password}${PWD_SALT}`)
    login(username, password).then(user => {
      if (!user || user.length === 0) {
        new Result('登录失败').fail(res)
      } else {
        const [_user] = user
        const token = jwt.sign({
          username
        }, PRIVATE_KEY, {expiresIn: JWT_EXPIRED})
        new Result({token}, '登录成功').success(res)
      }
    })
  }

})

module.exports = router