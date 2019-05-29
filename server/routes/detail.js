var express = require('express');
var router = express.Router();
var sugar = require('../data/modules/blood-sugar.js')
var pressure = require("../data/modules/blood-pressure.js")

//血糖  日
router.get('/blood-sugar/today', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    sugar.getSugarData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            for(let item of data) {
                if(item.date >= today.getTime()) {
                    resultData.push(item)
                }
            }
            resultData = classifyByDate(resultData)
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//血糖  周
router.get('/blood-sugar/week', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    sugar.getSugarData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            let week = 1000 * 60 * 60 * 24 * 7
            for(let item of data) {
                if(item.date >= (today.getTime() - week)) {
                    resultData.push(item)
                }
            }
            resultData = classifyByDate(resultData)
            // console.log(resultData)
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//血糖  月
router.get('/blood-sugar/month', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    sugar.getSugarData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            let month = 1000 * 60 * 60 * 24 * 30
            for(let item of data) {
                if(item.date >= (today.getTime() - month)) {
                    resultData.push(item)
                }
            }
            resultData = classifyByDate(resultData)
            // console.log(resultData)
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//列表数据--月
router.get('/blood-sugar/list', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    sugar.getSugarData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            let month = 1000 * 60 * 60 * 24 * 30
            for(let item of data) {
                if(item.date >= (today.getTime() - month)) {
                    resultData.push(item)
                }
            }
            // console.log(resultData)
            result = common.success('成功', resultData)
            console.log(result)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//处理数组--凌晨早中晚
function classifyByDate(arr) {
    let obj = {
        beforeDawn: [],
        morning: [],
        noon: [],
        dusk: [],
    }
    for(let item of arr) {
        let date = new Date(item.date)
        let time = date.getHours()
        if(time >= 0 && time < 6) {
            // console.log('凌晨')
            obj.beforeDawn.push(item.blood_sugar)
        } else if(time >= 6 && time < 10) {
            // console.log('早晨')
            obj.morning.push(item.blood_sugar)
        } else if(time >= 11 && time < 15) {
            // console.log('中午')
            obj.noon.push(item.blood_sugar)
        } else if(time >= 16 && time < 20) {
            // console.log('黄昏')
            obj.dusk.push(item.blood_sugar)
        } 
    }
    // console.log(obj)
    return obj
}

//血压  日
router.get('/blood-pressure/today', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    pressure.getPressureData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            for(let item of data) {
                if(item.date >= today.getTime()) {
                    resultData.push(item)
                }
            }
            // console.log(resultData)
            resultData = classifyPressureByDate(resultData)
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//血压  周
router.get('/blood-pressure/week', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    pressure.getPressureData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            let week = 1000 * 60 * 60 * 24 * 7
            for(let item of data) {
                if(item.date >= (today.getTime() - week)) {
                    resultData.push(item)
                }
            }
            resultData = classifyPressureByDate(resultData)
            // console.log(resultData)
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//血压  月
router.get('/blood-pressure/month', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    pressure.getPressureData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            let month = 1000 * 60 * 60 * 24 * 30
            for(let item of data) {
                if(item.date >= (today.getTime() - month)) {
                    resultData.push(item)
                }
            }
            console.log(resultData)
            resultData = classifyPressureByDate(resultData)
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//血压列表  月
router.get('/blood-pressure/list', (req, res) => {
    if(!req.user.name) {
        console.log('权限问题')
    }
    let user = req.user.name
    pressure.getPressureData(user, (data) => {
        if(data.length > 0) {
            let resultData = []
            let today = new Date(new Date().setHours(0, 0, 0, 0))
            let month = 1000 * 60 * 60 * 24 * 30
            for(let item of data) {
                if(item.date >= (today.getTime() - month)) {
                    resultData.push(item)
                }
            }
            result = common.success('成功', resultData)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})
//处理数组--凌晨早中晚
function classifyPressureByDate(arr) {
    let obj = {
        beforeSleep: [],
        morning: [],
        noon: [],
        dusk: [],
    }
    for(let item of arr) {
        let date = new Date(item.date)
        let time = date.getHours()
        if(time >= 21 && time < 24) {
            // console.log('睡前')
            obj.beforeDawn.push({ 
                pressureHigh: item.pressure_high, 
                pressureLow: item.pressure_low
            })
        } else if(time >= 6 && time < 10) {
            // console.log('早晨')
            obj.morning.push({ 
                pressureHigh: item.pressure_high, 
                pressureLow: item.pressure_low
            })
        } else if(time >= 11 && time < 15) {
            // console.log('中午')
            obj.noon.push({ 
                pressureHigh: item.pressure_high, 
                pressureLow: item.pressure_low
            })
        } else if(time >= 16 && time < 20) {
            // console.log('黄昏')
            obj.dusk.push({ 
                pressureHigh: item.pressure_high, 
                pressureLow: item.pressure_low
            })
        } 
    }
    console.log(obj)
    return obj
}

/* 原版 
//
// router.get('/blood-sugar' ,(req, res) => {
//     if(!req.user.name) {
//         console.log('权限问题')
//     }
//     var userData = req.user.name
//     sugar.getSugarData(userData, (data) => {
//         if(data.length > 0) {
//             myData = common.stringToObj(data[0].u_data)
//             result = common.success('成功', myData)
//             res.send(result)
//         } else {
//             result = common.error('失败')
//             res.send(result)
//         }
//     })
// })

// router.get('/blood-pressure' ,(req, res) => {
//     if(!req.user.name) {
//         console.log('权限问题')
//     }
//     var userData = req.user.name
//     pressure.getPressureData(userData, (data) => {
//         if(data.length > 0) {
//             myData = common.stringToObj(data[0].u_data)
//             result = common.success('成功', myData)
//             console.log(result)
//             res.send(result)
//         } else {
//             result = common.error('失败')
//             res.send(result)
//         }
//     })
// })
//
*/

module.exports = router;