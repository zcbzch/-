/**
 * 生成模拟数据
 * 每日更新数据
 */

var pool = require('../connectPool.js');

function random(base, dValue, digit = 0) {
    return (parseFloat(Math.random() * dValue) + base).toFixed(digit)
}

function createDataSugar(username, hours,sugar) {

    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let now = new Date().getTime()
    let hour = 1000 * 60 * 60
    let day = 1000 * 60 * 60 * 24
    var data = []
    //加密
    function handleData(data) {
        let str = 's'
        function change() {
            if(data <= 2.8) {
                str += 'l'
            } else if(data > 2.8 && data <= 6.1) {
                str += 'n'
                if(data <= 3.9) {
                    str += 'l'
                    if (data > 3.8) { str += 'm' } 
                    else if (data > 3.5 && data <= 3.8) { str += 'a' }
                    else if (data >= 3.3 && data <= 3.5) { str += 'b' }
                    else if (data < 3.3) { str += 'c' }
                } else if(data > 3.9 && data <= 5.5) {
                    str += 'n'
                    if (data > 5.4) { str += 'm';return }
                    else if (data > 4.8 && data <= 5.4) { str += 'a' }
                    else if (data >= 4.6 && data <= 4.8) { str += 'b' }
                    else if (data < 4.6) { str += 'c' }
                    
                } else if(data > 5.5 && data <= 6.1) {
                    str += 'h'
                        if (data > 6.0) { str += 'm' }
                        else if (data > 5.9 && data <= 6.0) { str += 'a' }
                        else if (data >= 5.8 && data <= 5.9) { str += 'b' }
                        else if (data < 5.8) { str += 'c' }
                }
            } else if(data > 6.1) {
                str += 'h'
                if(data <= 7.0) {
                    str += 'h'
                        if (data > 6.9) { str += 'm' }
                        else if (data > 6.8 && data <= 6.9) { str += 'a' }
                        else if (data >= 6.4 && data <= 6.6) { str += 'b' }
                        else if (data < 6.3) { str += 'c' }

                } else if(data > 7.0 && data <= 8.4) {
                    str += 'l'
                        if (data > 8.2) { str += 'm' }
                        else if (data > 7.8 && data <= 8.2) { str += 'a' }
                        else if (data >= 7.6 && data <= 7.8) { str += 'b' }
                        else if (data < 7.6) { str += 'c' }

                } else if(data > 8.4 && data <= 11.1) {
                    str += 'm'
                        if (data > 10.8) { str += 'm' }
                        else if (data > 10.5 && data <= 10.8) { str += 'a' }
                        else if (data >= 9.7 && data <= 9.9) { str += 'b' }
                        else if (data < 9.1) { str += 'c' }

                } else if(data > 11.1) {
                    str += 's'
                }
            }
        }
        change()
        //不够5位补全
        function completion(str) {
            let arr = ['c', 'b', 'a', 'm']
            str += arr[Math.round(Math.random() * 3)]
            if(str.length < 5) {
                completion(str)
            }
            return str
        }
        str = completion(str)
        return str
    }

    pool.getConnection(async(err, connection) => {
        let date = now - hours * hour
        let blood_sugar = handleData(sugar)
        let sql = `select user_id from user where username = '${username}'`
        connection.query(sql, (err, row) => {
            if(err) throw err
            user_id = row[0].user_id

            let sql2 = `insert into blood_sugar 
                        (date, user_id, blood_sugar) values
                        (${date}, ${user_id}, '${blood_sugar}')`
            
            connection.query(sql2, (err, row) => {
                if(err) throw err
                console.log(`添加(${date}, ${user_id}, '${blood_sugar}')成功`)
                connection.release()
            })
        })
    })
}


function createDataPressure(username, hours, pressureHigh, pressureLow) {

    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let now = new Date().getTime()
    let hour = 1000 * 60 * 60
    let day = 1000 * 60 * 60 * 24
    var data = []
    //加密 高压
    function handleDataHigh(data) {
        let str = 'p'
        function change() {
            if(data <= 90) {
                str += 'l'
            } else if(data > 90 && data <= 140) {
                str += 'n'
                if(data <= 120) {
                    str += 'n'
                    if (data > 115) { str += 'm' } 
                    else if (data > 107 && data <= 115) { str += 'a' }
                    else if (data >= 103 && data <= 107) { str += 'b' }
                    else if (data < 103) { str += 'c' }
                } else if(data > 120 && data <= 140) {
                    str += 'h'
                    if (data > 138) { str += 'm';return }
                    else if (data > 133 && data <= 138) { str += 'a' }
                    else if (data >= 127 && data <= 133) { str += 'b' }
                    else if (data < 127) { str += 'c' }
                    
                } 
            } else if(data > 140) {
                str += 'h'
                if(data <= 160) {
                    str += 'l'
                        if (data > 157) { str += 'm' }
                        else if (data > 152 && data <= 157) { str += 'a' }
                        else if (data >= 147 && data <= 152) { str += 'b' }
                        else if (data < 147) { str += 'c' }
    
                } else if(data > 160 && data <= 180) {
                    str += 'm'
                        if (data > 177) { str += 'm' }
                        else if (data > 172 && data <= 177) { str += 'a' }
                        else if (data >= 167 && data <= 172) { str += 'b' }
                        else if (data < 167) { str += 'c' }
    
                } else if(data > 180) {
                    str += 's'
                }
            }
        }
        change()
        // console.log(str)
        //不够5位补全
        function completion(str) {
            let arr = ['c', 'b', 'a', 'm']
            str += arr[Math.round(Math.random() * 3)]
            if(str.length < 5) {
                completion(str)
            }
            return str
        }
        str = completion(str)
        return str
    }

    //加密 低压
    function handleDataLow(data) {
        let str = 'p'
        function change() {
            if(data <= 60) {
                str += 'l'
            } else if(data > 60 && data <= 90) {
                str += 'n'
                if(data <= 80) {
                    str += 'n'
                    if (data > 76) { str += 'm' } 
                    else if (data > 72 && data <= 76) { str += 'a' }
                    else if (data >= 67 && data <= 72) { str += 'b' }
                    else if (data < 67) { str += 'c' }
                } else if(data > 80 && data <= 90) {
                    str += 'h'
                    if (data > 88) { str += 'm';return }
                    else if (data > 86 && data <= 88) { str += 'a' }
                    else if (data >= 84 && data <= 86) { str += 'b' }
                    else if (data < 84) { str += 'c' }
                    
                } 
            } else if(data > 90) {
                str += 'h'
                if(data <= 100) {
                    str += 'l'
                        if (data > 98) { str += 'm' }
                        else if (data > 96 && data <= 98) { str += 'a' }
                        else if (data >= 94 && data <= 96) { str += 'b' }
                        else if (data < 94) { str += 'c' }
    
                } else if(data > 100 && data <= 110) {
                    str += 'm'
                        if (data > 108) { str += 'm' }
                        else if (data > 106 && data <= 108) { str += 'a' }
                        else if (data >= 104 && data <= 106) { str += 'b' }
                        else if (data < 104) { str += 'c' }
    
                } else if(data > 110) {
                    str += 's'
                }
            }
        }
        change()
        //不够5位补全
        function completion(str) {
            let arr = ['c', 'b', 'a', 'm']
            let l = Math.round(Math.random() * 3)
            // console.log(l)
            str += arr[l]
            if(str.length < 5) {
                completion(str)
            }
            return str
        }
        str = completion(str)
        return str
    }

    pool.getConnection(async(err, connection) => {
        let date = now - hours * hour
        let blood_pressureHigh = handleDataHigh(pressureHigh)
        let blood_pressureLow = handleDataLow(pressureLow)
        let sql = `select user_id from user where username = '${username}'`
        connection.query(sql, (err, row) => {
            if(err) throw err
            user_id = row[0].user_id

            let sql2 = `insert into blood_pressure 
                        (date, user_id, pressure_high, pressure_low) values
                        (${date}, ${user_id}, '${blood_pressureHigh}', '${blood_pressureLow}')`
            
            connection.query(sql2, (err, row) => {
                if(err) throw err
                console.log(`添加(${date}, ${user_id}, '${blood_pressureHigh}', '${blood_pressureLow}')成功`)
                connection.release()
            })
        })
    })
}
// createDataSugar('zhangsan', 18, 6.2)
// createDataSugar('zhangsan', 16, 6.9)
// createDataSugar('zhangsan', 19, 6.5)
// createDataSugar('zhangsan', 21, 5.8)
// createDataSugar('zhangsan', 24, 7.1)
// createDataPressure('zhangsan', 1, 144, 85)
// createDataPressure('zhangsan', 16, 136, 81)
// createDataPressure('zhangsan', 9, 143, 89)
// createDataPressure('zhangsan', 12, 139, 85)
// createDataPressure('zhangsan', 15, 150, 83)

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


// createDataPressure('zhangsan')
// updateData()
