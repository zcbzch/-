// let str = 'eyJuYW1lIjoiemhhbmdzYW4iLCJpZCI6MSwiaWF0IjoxNTU4MjUwMzYyLCJleHAiOjE1NTgyNTc1NjJ9'
// let buffer = new Buffer.from(str, 'base64')
// let obj = base.toString()
// console.log(b)

function classifyByDate(arr) {
    let obj = {
        beforeDawn: [],
        morning: [],
        noon: [],
        dusk: [],
    }
    for(let item of arr) {
        let date = new Date(item.date)
        let time = date.getHours()
        if(time >= 0 && time < 6) {
            console.log('凌晨')
            obj.beforeDawn.push(item.blood_sugar)
        } else if(time >= 6 && time < 10) {
            console.log('早晨')
            obj.morning.push(item.blood_sugar)
        } else if(time >= 11 && time < 15) {
            console.log('中午')
            obj.noon.push(item.blood_sugar)
        } else if(time >= 16 && time < 20) {
            console.log('黄昏')
            obj.dusk.push(item.blood_sugar)
        } 
    }
    console.log(obj)
}

// classifyByDate([
//     {
//         date: 1351623423156,
//         sugar: 6.1
//     },
//     {
//         date: 1351659423000,
//         sugar: 6.6
//     }
// ])

// let now = new Date()
// let today = new Date(new Date().setHours(0, 0, 0, 0))
// console.log(now.getTime())
// console.log(today.getTime())

function sortBobble(arr) {
    let result = []
    while(arr.length > 0){
        let tmp = arr[0].date
        let index = 0
        for(let j = 0; j < arr.length; j++) {
            if(tmp < arr[j].date) {'s'}
            else {
                tmp = arr[j].date
                index = j
            }
        }
        result.push(arr[index])
        arr.splice(index, 1)
    }
}
sortBobble([ 
    { date: 1558826592915, blood_sugar: 'snnaa' },
    { date: 1558841394000, blood_sugar: 'snnac' },
    { date: 1558812594000, blood_sugar: 'shlca' },
    { date: 1558931415703, blood_sugar: 'shhbb' } 
])