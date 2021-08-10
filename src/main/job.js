const schedule = require('node-schedule')
const Job = require('../plugins/Job')
const Olympics = require('../plugins/Olympics')
const group = [578111062]
const ol = [578111062, 757360354]
schedule.scheduleJob('*/10 * * * *', () => {
    // 原神资讯
    // Job.yuanshen(578111062)
    // Job.m_8kcosplay(454417041)
    // Job.m_8kcosplay(757360354)
    // Job.zuxingjian(454417041)
    // Job.zuxingjianPhoto(454417041)
    // Job.zuxingjianArtical(454417041)
    group.forEach(e => {
        Job.yuanshen(e)
        // Job.zuxingjian(e)
        // Job.zuxingjianPhoto(e)
        // Job.zuxingjianArtical(e)
    });
})

// schedule.scheduleJob('0 0 9,12,18 * * *', () => {
//     ol.forEach(g => {
//         Olympics.doAction(g)
//     })
// })
