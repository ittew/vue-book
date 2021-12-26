const { querySql, add, addLike } = require('../db')

async function getCategory() {
  const sql = `select * from category order by category asc`
  const result = await querySql(sql)
  const categoryList = []
  result.map(item => {
    categoryList.push({
        label: item.categoryText,
        value: item.category,
        num: item.num
    })
  })
  return categoryList
}

async function getBookList(query) {
    console.log(query)
    const { page = 1, pageSize = 20, sort, category, title, author } = query
    const offset = (page - 1) * pageSize
    let bookSql = `select * from book`
    let where = 'where'
    title && (where = addLike(where, 'title', title))
    author && (where = addLike(where, 'author', author))
    category && (where = add(where, 'category', category))
    if (where !== 'where') {
        bookSql = `${bookSql} ${where}`
    }
    if (sort) {
        const symbol = sort[0]
        const column = sort.substring(1)
        const order = symbol === '+' ? 'asc' : 'desc'
        bookSql = `${bookSql} order by \`${column}\` ${order}`
    }

    let countSql = `select count(*) as count from book`
    if (where !== 'where') {
        countSql = `${countSql} ${where}`
    } 
    const count = await querySql(countSql)
    bookSql = `${bookSql} limit ${pageSize} offset ${offset}`
    const list = await querySql(bookSql)
    list.map(book => book.cover = `https://book.youbaobao.xyz/book/res/img${book.cover}`)
    return { list, count: count[0].count, page, pageSize } 
}

module.exports = {
  getCategory,
  getBookList
}