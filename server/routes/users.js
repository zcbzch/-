var express = require('express');
var router = express.Router();
var users = require('../data/modules/users.js')

router.post('/login' ,(req, res) => {
  var userData = req.body
  users.getUserList(userData, (data) => {
    // console.log(req.session.username)
    if(data.length) {
      if(!req.session.username) {
        req.session.username = data[0].username
      }
      // console.log(req.sessionID)
      data[0]['session_id'] = req.sessionID
      result = common.success('成功', data)
      res.send(result)
    } else {
      result = common.error('用户名或密码错误')
      res.send(result)
    }
  })
})

module.exports = router;
