const express = require('express')
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../models/Result')
const router = express.Router()
const boom = require('boom')
const { getCategory, getBookList, deleteBook } = require('../service/book');
router.post(
    '/upload',
    multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
    function(req, res, next) {
      if (!req.file || req.file.length === 0) {
        new Result('上传电子书失败').fail(res)
      } else {
        new Result('上传成功').success(res)  
      }
    }
)

router.get('/getCategory', function(req, res, next) {
    getCategory().then(category => {
        new Result(category, '获取分类成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/getBookList', function(req, res, next) {
    getBookList(req.query).then((data) => {
        new Result(data, '获取图书列表成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/deleteBook', function(req, res, next) {
    const {fileName} = req.query
    console.log(req.query);
    if (!fileName) {
        next(boom.badImplementation(new Error('参数fileName不能为空')))
    } else {
        deleteBook(fileName).then(() => {
            new Result('删除图书成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})

module.exports = router