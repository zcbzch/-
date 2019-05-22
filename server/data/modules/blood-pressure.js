var pool = require('../connectPool.js');

var pressure = {
    getPressureData(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = `select u_data from blood_pressure where username = "${data}"`
            connection.query(sql, (err, data) => {
                if(err) throw err
                callback(data)
                connection.release()
            })
        })
    }
}

module.exports = pressure