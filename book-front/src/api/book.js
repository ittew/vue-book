import request from '@/utils/request'

export function getCategory() {
  return request({
    url: '/book/getCategory',
    method: 'get'
  })
}

export function getBookList(params) {
  return request({
    url: '/book/getBookList',
    method: 'get',
    params
  })
}

export function deleteBook(fileName) {
  return request({
    url: '/book/deleteBook',
    method: 'get',
    params: { fileName }
  })
}
