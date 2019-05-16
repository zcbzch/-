var common = {
    success: (msg, data, toObject = 0) => {
        data = JSON.stringify(data)
        data = JSON.parse(data)
        if(toObject) {
            data = (new Function("return " + data))()
        }
        return {
            code: 200000,
            message: msg,
            data: data,
        }
    },
    error: (msg) => {
        return {
            code: 200001,
            message: msg,
        }
    }
}
// class BusinessError extends Error {
// constructor (code, msg) {
//     super(msg)
//         this.code = code
//         this.msg = msg
//         this.name = 'BusinessError'
//     }
// }

module.exports = common