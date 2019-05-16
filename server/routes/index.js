var express = require('express');
var router = express.Router();

//综合
router.get('/mutiple', (req, res) => {
  if(req.headers.authorization == req.sessionID) {
    // console.log(req.session.username)
    var m = 40
    result = common.success('成功', m)
    res.send(result)
  } else {
    result = common.error('登录过期，请重新登录')
    res.send(result)
  }
})

//血糖
router.get('/blood-sugar', (req, res) => {
  if(!req.headers.authorization == req.sessionID) {
    result = common.error('登录过期，请重新登录')
    res.send(result)
  }
  var m = 70
  result = common.success('成功', m)
  res.send(result)
});

//血压
router.get('/blood-pressure', (req, res) => {
  if(!req.headers.authorization == req.sessionID) {
    result = common.error('登录过期，请重新登录')
    res.send(result)
  }
  var m = 20
  result = common.success('成功', m)
  res.send(result)
});

module.exports = router;
