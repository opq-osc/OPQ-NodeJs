// require('./src/main/text')
// require('./src/main/picture')
// require('./src/main/joinGroup')
// require('./src/main/Bili')
// console.log("opq-nodejs正在启动。。。");

// const CRUD = require('./src/plugins/mongodb/crud')
// const BiliUp = require('./src/plugins/BiliUp')
const schedule = require('node-schedule')
const axios = require('axios')
schedule.scheduleJob('0 0,10,20,30,40,50 * * * *', () => {
    console.log('定时推送')
    // BiliUp.pushNews()
})
// async function getInfo() {
//     // let result = []
//     // await CRUD.listAll().then(res => {
//     //     result = res
//     // })
//     // if (result.length > 0) {
//     //     const lastData = arrayGroupBy(result, 'mid');
//     //     console.log(lastData['473837612'])
//     // }
//     await BiliUp.pushNews()

//     // let a = 1
//     // for (let index = 0; index < 1000; index++) {
//     //     if(index == 999){
//     //         a = 2
//     //     }
        
//     // }
//     // console.log(a);


// }

// function arrayGroupBy(list, groupId) {
//     function groupBy(array, f) {
//         const groups = {}
//         array.forEach(function (o) {
//             const group = JSON.stringify(f(o))
//             groups[group] = groups[group] || []
//             groups[group].push(o)
//         })

//         return groups
//         // return Object.keys(groups).map(function (group) {
//         //     return groups[group]
//         // })
//     }
//     return groupBy(list, function (item) {
//         return item[groupId]
//     })
// }

// getInfo()

// function test() {
//     let a = new Map()
//     a.set(1, '2222')
//     a.set(2, '33333')
//     a.forEach((value, key) => {
//         console.log('key:' + key + ', value:' + value)
//     })
// }

// // test()