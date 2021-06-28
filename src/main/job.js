const schedule = require('node-schedule')
const Job = require('../plugins/Job')
const group = [578111062,230349459]

schedule.scheduleJob('*/5 * * * *', () => {
    // 原神资讯
    group.forEach(e => {
        Job.yuanshen(e)
    });
})
