var express = require('express');
var router = express.Router();
var users = require('../data/modules/users.js')

// var bodyParser = require('body-parser');
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// var session = require('express-session');
// var SessionStore = require('express-mysql-session');
// var settings = require('../data/settings.js');

// var sessionStore = new SessionStore({
//   host: settings.host,
//   port: settings.port,
//   user: settings.user,
//   password: settings.password,
//   database: settings.database,
// })
// var identity = function (username, password) {
//   return users.find((item) => {
//     return item.username === username && item.password == password
//   })
// }
router.post('/login' ,(req, res) => {
  var userData = req.body
  users.getUserList(userData, (data) => {
    if(data.length) {
      result = common.success('成功', data)
      res.send(result)
    } else {
      result = common.error('用户名或密码错误')
      res.send(result)
    }
  })
})


// router.get('/login', function(req, res, next) {
//   var session = req.session 
//   var user = identity(req.body.name, req.body.password)

//   if(user){
//     //分配 session.id 
//     req.session.regenerate(function(err) {
//       if(err){
//         return res.json({code: 2, msg: '登录失败'});        
//       }
//       req.session.loginUser = user.name;
//       res.json({code: 0, msg: '登录成功'});              
//     });
//   }else{
//     res.json({code: 1, msg: '账号或密码错误'});
//   } 
// });

module.exports = router;
