var pool = require('../connectPool.js');

var pressure = {
    getPressureData(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = ` select date, pressure_high, pressure_low
                        from blood_pressure
                        where user_id = 
                            (select user_id
                            from user
                            where username = "${data}");`
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

module.exports = pressure