const schedule = require('node-schedule')
const Job = require('../plugins/Job')
const group = [578111062,454417041]

schedule.scheduleJob('*/5 * * * *', () => {
    // 原神资讯
    // Job.yuanshen(578111062)
    // Job.m_8kcosplay(454417041)
    Job.zuxingjian(454417041)
    Job.zuxingjianPhoto(454417041)
    group.forEach(e => {
        Job.yuanshen(e)
        // Job.zuxingjian(e)
        // Job.m_8kcosplay(e)
    });
})
