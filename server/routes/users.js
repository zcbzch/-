var express = require('express');
var router = express.Router();
var users = require('../data/modules/users.js')
var jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  var userData = req.body
  var resultData = {}
  users.getUserList(userData, (data) => {
    if(data.length) {
      var token = jwt.sign({
          name: data[0].username,
          id: data[0].user_id,
      }, 'health', {
          expiresIn: '2h'
      })
      resultData = {
          username: data[0].username,
          token: token
      }
      result = common.success('登录成功', resultData)
      res.send(result)
    } else {
      result = common.error('用户名或密码错误')
      res.send(result)
      // return
    }
  })
})

router.get('/information', async (req, res) => {
  let userData = req.user.name
  let resultData = {}
  users.getUserInformation(userData, (data) => {
    // console.log(data)
    if(data.length) {
      for(let i in data[0]) {
        resultData[i] = data[0][i]
      }
      if(resultData.sex == 'male') {
        resultData.sex = '男'
      } else if(resultData.sex == 'female') {
        resultData.sex = '女'
      }
      result = common.success('成功', resultData)
      console.log(result)
      res.send(result)
    }
  })
})

module.exports = router;
