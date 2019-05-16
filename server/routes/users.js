var express = require('express');
var router = express.Router();
var users = require('../data/modules/users.js')
var jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  var userData = req.body
  users.getUserList(userData, (data) => {
    if(data.length) {
      var token = jwt.sign({
          name: data[0].username,
          id: data[0].user_id,
      }, 'health', {
          expiresIn: '2h'
      })
      data = {
          username: data[0].username,
          token: token
      }
      result = common.success('登录成功', data)
      res.send(result)
    } else {
      result = common.error('用户名或密码错误')
      res.send(result)
    }
  })
})

module.exports = router;
