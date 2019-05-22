/**
 * 生成模拟数据
 * 每日更新数据
 */

var pool = require('../connectPool.js');

function random(base, dValue, digit = 0) {
    return (parseFloat(Math.random() * dValue) + base).toFixed(digit)
}

// function pressureRandom(base, dValue) {
//     return (parseFloat(Math.random() * base) + dValue).toFixed(2)
// }

function createDataSugar(username) {
    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let day = 1000 * 60 * 60 * 24
    var data = []
    
    for(let i = 0; i < 30; i++) {
        data.push({
            date: time - day * i,
            data: new Array(random(4, 3.5, 2), random(4, 3.5, 2), random(4, 3.5, 2), random(4, 3.5, 2))
        }) 
    }
    data = JSON.stringify(data)
    // console.log(data)
    pool.getConnection((err, connection) => {
        var sql = `update blood_sugar set u_data = '${data}' where username = '${username}'`
        connection.query(sql, (err, row) => {
            if(err) throw err
            connection.release()
        })
    })
}

function createDataPressure(username) {
    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let day = 1000 * 60 * 60 * 24
    var data = []
    
    for(let i = 0; i < 30; i++) {
        data.push({
            date: time - day * i,
            data: new Array(random(120, 20), random(70, 20), random(60, 20))
        }) 
    }
    data = JSON.stringify(data)
    pool.getConnection((err, connection) => {
        var sql = `update blood_pressure set u_data = '${data}' where username = '${username}'`
        connection.query(sql, (err, row) => {
            if(err) throw err
            connection.release()
        })
    })
}
// function updateData() {
//     let current = new Date()
//     let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
//     let next = new Date(new Date().setHours(24, 0, 0, 0))
//     // console.log(current)
//     // console.log(next)
//     setTimeout(execute, next - current)
//     function execute() {
//         data.pop()
//         data.unshift({
//             date: time,
//             data: new Array(random(), random(), random())
//         })
//         setTimeout(execute, 1000 * 60 * 60 * 24)
//     }
// }

createDataSugar('lisi')
createDataPressure('zhangsan')
// updateData()
