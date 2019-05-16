var express = require('express');
var router = express.Router();
var sugar = require('../data/modules/blood-sugar.js')

router.get('/blood-sugar' ,(req, res) => {
    var userData = req.query.username
    sugar.getSugarData(userData, (data) => {
        if(data.length > 0) {
            result = common.success('成功', data[0].u_data, 1)
            res.send(result)
        } else {
            result = common.error('失败')
            res.send(result)
        }
    })
})

module.exports = router;