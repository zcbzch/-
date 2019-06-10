var express = require('express');
var router = express.Router();
var sugar = require('../data/modules/blood-sugar.js')
var pressure = require('../data/modules/blood-pressure.js')
//综合
router.get('/mutiple', (req, res) => {
    if(!req.user.name) {
      console.log('权限问题')
    }
    var userData = req.user.name
    sugar.getSugarData(userData, (data) => {
      if(data.length > 0) {
          let myData = common.stringToObj(data[0].u_data)
          let average = handleData(myData)
          let risk = caculateRiskNum(average)
          result = common.success('成功', {riskNum:risk})
          res.send(result)
      } else {
          result = common.error('失败')
          res.send(result)
      }
    })

    //早中晚平均数,凌晨平均数
    function handleData(array) {
      let average = {
        emptyStomach: 0,
        beforeDawn: 0,
      }
      // console.log(average)
      for(let i of array) {
        average.beforeDawn += parseFloat(i.data[0])
        average.emptyStomach += parseFloat(i.data[1]) + parseFloat(i.data[2]) + parseFloat(i.data[3])
      }
      average.beforeDawn = Math.round((average.beforeDawn / 30) * 100) / 100
      average.emptyStomach = Math.round((average.emptyStomach / 90) * 100) / 100
      // console.log(average)
      
      return average
    }
    //危险度计算
    function caculateRiskNum(m) {
      // let m = object.emptyStomach
      if(m > 6.1 && m <= 8.4) {
        m = (m - 5) / 1.7 + 1
        m = Math.pow(m, -2)
        m = 1 / m
      } else if(m > 3.9 && m <= 6.1) {
        m = Math.pow(m - 5, 4)
      } else if(m <= 3.9) {
        m = (5 - m) / 1.7 + 1
        m = Math.pow(m, -2)
        m = 1 / m
      }
      return Math.round(m * 100)
    }
})

//血糖
router.get('/blood-sugar', (req, res) => {
  if(!req.headers.authorization == req.sessionID) {
    result = common.error('登录过期，请重新登录')
    res.send(result)
  }
  var userData = req.user.name
  sugar.getSugarData(userData, (data) => {
    if(data.length > 0) {
        let myData = common.stringToObj(data[0].u_data)
        let average = handleData(myData)
        let risk = caculateRiskNum(average)
        result = common.success('成功', {riskNum:risk})
        res.send(result)
    } else {
        result = common.error('失败')
        res.send(result)
    }
  })
});

//血压
router.get('/blood-pressure', (req, res) => {
  if(!req.headers.authorization == req.sessionID) {
    result = common.error('登录过期，请重新登录')
    res.send(result)
  }
  var userData = req.user.name
  pressure.getPressureData(userData, (data) => {
    if(data.length > 0) {
        let myData = common.stringToObj(data[0].u_data)
        let average = handleData(myData)
        let risk = caculateRiskNum(average)
        result = common.success('成功', {riskNum:risk})
        res.send(result)
    } else {
        result = common.error('失败')
        res.send(result)
    }
  })
});

module.exports = router;
