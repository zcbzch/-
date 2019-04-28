var pool = require('../connectPool.js');

var users = {
    getUserList(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = `select username from login where username = "${data.username}" and password = "${data.password}"`
            console.log(sql)
            connection.query(sql, (err, data) => {
                if(err) throw err
                callback(data)
                connection.release()
            })
        })
    }
}

module.exports = users