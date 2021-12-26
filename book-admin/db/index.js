const mysql = require('mysql')
const { DEBUG } = require('../utils/constant')
const { host, user, password, database} = require('./config')
function connect() {
  return mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
  })
}
function querySql(sql) {
    const conn = connect()
    DEBUG && console.log(sql)
    return new Promise((resolve, reject) => {
      try {
        conn.query(sql, (err, results) => {
          if (err) {
            DEBUG && console.log('查询失败，原因:' + JSON.stringify(err, null, 2))
            reject(err)
          } else {
            DEBUG && console.log('查询成功', JSON.stringify(results, null, 2))
            resolve(results)
          }
        })
      } catch (e) {
        reject(e)
      } finally {
        conn.end()
      }
    })
}
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(results => {
      console.log(results)
      if (results && results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

function add(where, k, v) {
  if(where === 'where') {
    return `${where} \`${k}\`='${v}'`
  } else {
    return `${where} and \`${k}\`='${v}'`
  }
}

function addLike(where, k, v) {
  if(where === 'where') {
    return `${where} \`${k}\` like '%${v}%'`
  } else {
    return `${where} and \`${k}\` like '%${v}%'`
  }
}


module.exports = {
  querySql,
  queryOne,
  add,
  addLike
}