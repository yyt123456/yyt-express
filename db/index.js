const mysql = require('mysql')
const config = require('./config')
const {debug} = require('../utils/constant')

function connect() {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function querySql(sql) {
  const conn = connect()
  debug && console.log(sql)
  return new Promise((res, rej) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug && console.log('查询失败，原因:' + JSON.stringify(err))
          rej(err)
        } else {
          debug && console.log('查询成功', JSON.stringify(results))
          res(results)
        }
      })
    } catch (e) {
      rej(e)
    } finally {
      conn.end()
    }

  })

}

module.exports = {
  querySql
}