var settings = require('./settings');
var mysql = require('mysql');

//使用连接池的连接方式
var pool  = mysql.createPool(settings);

module.exports = pool;