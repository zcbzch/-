var pool = require('../connectPool.js');

var sugar = {
    getSugarData(data, callback) {
        pool.getConnection((err, connection) => {
            var sql = ` select date, blood_sugar 
                        from blood_sugar 
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

module.exports = sugar