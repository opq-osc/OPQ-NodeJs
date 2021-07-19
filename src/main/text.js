const fs = require('fs')
const socket = require('../Socket').getSocket()
const History = require('../plugins/History')
const Baike = require('../plugins/Baike')
const Constellation = require('../plugins/Constellation')
const HPicture = require('../plugins/HPicture')
const Typhoon = require('../plugins/Typhoon')
const config = JSON.parse(fs.readFileSync('./config/opqConfig.json'))
const pattern = config.PATTERN
socket.on('OnGroupMsgs', async data => {
    console.log('>>OnGroupMsgs', JSON.stringify(data, null, 2))
    const { FromGroupId, FromUserId, Content, MsgType, MsgSeq, MsgRandom } = data.CurrentPacket.Data
    if (MsgType == 'TextMsg') {
        switch (Content) {
            case '历史上的今天':
                await History.doAction(FromGroupId)
                break
            case '台风':
                await Typhoon.doAction(FromGroupId)
                break
        }
        if (Content.indexOf("百科") == 0) {
            await Baike.doAction(FromGroupId, Content)
        }
        if (Content.indexOf("运势") == 0) {
            await Constellation.doAction(FromGroupId, Content)
        }
        if (Content.match(pattern)) {
            const arr = Content.match(pattern)
            await HPicture.doAction(FromGroupId, arr)
        }
    }
})