## 技术难点分析
#### 登录
![登录流程](./images/login_process.58cab9a5.png)
* 用户名密码校验
* token生成\校验和路由过滤
* 前端token校验和重定向
#### 电子书上传
* 文件上传
* 静态资源服务器
#### 电子书解析
* epub原理
* zip解压
* xml解析
#### 电子书增删改
* mysql数据库应用
* 前后端异常处理


```js
// 检测大小写开关
checkCapslock({ shiftKey, key } = {}) {
    console.log(shiftKey, key)
    if (key && key.length === 1) {
        if ((shiftKey && (key >= 'A' && key <= 'Z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))) {
            this.capsTooltip = true
        } else {
            this.capsTooltip = false
        }
    } else {
        this.capsTooltip = false
    }
    if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
    }
}
```