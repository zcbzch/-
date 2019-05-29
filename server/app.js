var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var common = require('./lib/common.js')
var indexRouter = require('./routes/index');
var detailRouter = require('./routes/detail');
var usersRouter = require('./routes/users');
var expressJWT = require('express-jwt');

var app = express();

global.common = common;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session)

app.use(expressJWT({
    secret: 'health'
}).unless({
    path: [
      {
        url: '/users/login', 
        methods: ['POST']
      },
      // {
      //   url: '/detail/blood-sugar', 
      //   methods: ['GET']
      // }
    ]
}))

// app.use((req, res, next) => {
//     let token = req.headers['authorization']
//     if(!token) next()
//     handleData()
//     function handleData() {
//       let firstIndex = token.indexOf(".")
//       let lastIndex = token.lastIndexOf(".")
//       let payLoad = token.slice(firstIndex + 1, lastIndex)
//       let buffer = new Buffer.from(payLoad, 'base64')
//       let obj = buffer.toString()
//       req['username'] = obj.name
//     }
//     console.log(req.user.name)
//     next()
// })

app.use('/index', indexRouter);
app.use('/detail', detailRouter);
app.use('/users', usersRouter);

//处理json数据，UTF-8数据. row-Buffer流数据，text-文本数据
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})



// app.post('/users/test', (req, res) => {
//   console.log(req.body)
// })
// sessionStore = new SessionStore({
//     host: settings.host,
//     port: settings.port,
//     user: settings.user,
//     password: settings.password,
//     database: settings.database,
//     schema: {
//         tableName: 'session',
//         columnNames: {
//             session_id: 'id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// })

//session中间件
// app.use(session({
//     name: 'identity',
//     secret: 'health', //对session id 相关的cookie 进行签名
//     store: new FileStore,
//     resave: false, //每次都重新保存
//     saveUninitialized: false, // 是否保存未初始化的会话
//     cookie: { maxAge: 1000 * 60 * 3 },
// }))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {   
//       res.status(401).send('invalid token...');
//     }
// });
module.exports = app;
