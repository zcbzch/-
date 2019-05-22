var express = require('express');
var router = express.Router();
var sugar = require('../data/modules/blood-sugar.js')
var pressure = require("../data/modules/blood-pressure.js")

router.get('/blood-sugar' ,(req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    var userData = req.user.name
    sugar.getSugarData(userData, (data) => {
        if(data.length > 0) {
            myData = common.stringToObj(data[0].u_data)
            result = common.success('成功', myData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})

router.get('/blood-pressure' ,(req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    var userData = req.user.name
    pressure.getPressureData(userData, (data) => {
        if(data.length > 0) {
            myData = common.stringToObj(data[0].u_data)
            result = common.success('成功', myData)
            console.log(result)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})

module.exports = router;