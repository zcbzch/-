import Express from 'express'
import bodyParser from 'body-parser'

var app = Express()

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})
//处理json数据，UTF-8数据. row-Buffer流数据，text-文本数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/getdata', ()=>{
    res.send({
        code: '100000',
        message: '成功',
        data: 77
    })
})

var server = app.listen(3000, ()=>{
    var port = server.address().port
    console.log('listening on port '+ port)
})