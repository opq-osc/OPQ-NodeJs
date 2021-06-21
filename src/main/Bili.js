const socket = require('../Socket').getSocket()
const schedule = require('node-schedule')
const BiliUp = require('../plugins/BiliUp')

socket.on('OnGroupMsgs', async data => {
    const { FromGroupId, Content, MsgType } = data.CurrentPacket.Data
    if (MsgType == 'TextMsg') {
        switch (Content) {
            case '本群订阅':
                await BiliUp.listUps(FromGroupId)
                break
            case 'cs':
                await BiliUp.pushNews()
                break
        }
        if (Content.indexOf("up搜索") == 0) {
            await BiliUp.searchUp(FromGroupId, Content.replace('up搜索', ''))
        }
        if (Content.indexOf("up订阅") == 0) {
            await BiliUp.subscribeUp(FromGroupId, Content.replace('up订阅', ''))
        }
        if (Content.indexOf("取消订阅") == 0) {
            await BiliUp.unSubscribeUp(FromGroupId, Content.replace('取消订阅', ''))
        }
    }
})


schedule.scheduleJob('0 0,10,20,30,40,50 * * * *', async () => {
    console.log('定时推送')
    await BiliUp.pushNews()
})