var pool = require('../connectPool.js');

var users = {
    getUserList(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = ` select username
                        from user 
                        where username = "${data.username}" 
                        and password = "${data.password}"`

            connection.query(sql, (err, data) => {
                if(err) throw(err)
                data = JSON.stringify(data)
                data = JSON.parse(data)
                callback(data)
                connection.release()
            })
        })
    },
    getUserInformation(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = ` select sex, age, height, weight
                        from user 
                        where username = "${data}"`

            connection.query(sql, (err, data) => {
                if(err) throw(err)
                // console.log(data)
                data = JSON.stringify(data)
                data = JSON.parse(data)
                callback(data)
                connection.release()
            })
        })
    }
}

module.exports = users