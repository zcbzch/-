var pool = require('../connectPool.js');

var users = {
    getUserList(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = `select username from login where username = "${data.username}" and password = "${data.password}"`
            connection.query(sql, (err, data) => {
                if(err) throw err
                data = JSON.stringify(data)
                data = JSON.parse(data)
                callback(data)
                connection.release()
            })
        })
    }
}

module.exports = users