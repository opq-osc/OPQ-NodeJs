const schedule = require('node-schedule')
const Job = require('../plugins/Job')
const Genshin = require('../plugins/Genshin')
const kimi = [578111062, 894170641]
const zzzz = [894170641]
const groups = [578111062, 757360354]
schedule.scheduleJob('0 30 * * * *', () => {
  // 原神资讯
  console.log('原神资讯推送');
  kimi.forEach(e => {
    Job.yuanshen(e)
    // Job.zuxingjian(e)
    // Job.zuxingjianPhoto(e)
    // Job.zuxingjianArtical(e)
  });
  //    zzzz.forEach(e => {
  //      Job.yuanshen(e)
  //      Job.zuxingjian(e)
  //    Job.zuxingjianPhoto(e)
  //  Job.zuxingjianArtical(e)
  //});
})

schedule.scheduleJob('0 0 12,18 * * *', () => {
  Genshin.getResin()
})

//schedule.scheduleJob('0 0 3,6,9,12 * * *', () => {
 //   zzzz.forEach(g => {
  //      Job.m_8kcosplay(g)
   //  })
//})

//schedule.scheduleJob('0 0 15,18,21,23 * * *', () => {
 //   zzzz.forEach(g => {
  //      Job.m_95mm(g)
   //  })
//})
