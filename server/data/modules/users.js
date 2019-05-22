var pool = require('../connectPool.js');

var users = {
    getUserList(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = `select user_id, username from login where username = "${data.username}" and password = "${data.password}"`
            connection.query(sql, (err, data) => {
                if(err) console.log(err)
                data = JSON.stringify(data)
                data = JSON.parse(data)
                callback(data)
                connection.release()
            })
        })
    },
    getUserInformation(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = `select * from user_information where username = "${data}"`
            connection.query(sql, (err, data) => {
                if(err) console.log(err)
                data = JSON.stringify(data)
                data = JSON.parse(data)
                callback(data)
                connection.release()
            })
        })
    }
}

module.exports = users