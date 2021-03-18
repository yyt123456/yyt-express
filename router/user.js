const express = require('express')
const Result = require('../modules/result')
const {login} = require('../services/user')
const router = express.Router()
const { md5 } = require('../utils/index')
const { PWD_SALT } = require('../utils/constant')


router.get('/info', function (req, res, next) {
  res.json('user info...')
})
router.post('/login', function (req, res, next) {
  let {username, password} = req.body
  password = md5(`${password}${PWD_SALT}`)
  login(username, password).then(user => {
    if (!user || user.length === 0) {
      new Result('登录失败').fail(res)
    } else {
      new Result('登录成功').success(res)
    }
  })

})

module.exports = router