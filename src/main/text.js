const fs = require('fs')
const socket = require('../Socket').getSocket()
const History = require('../plugins/History')
const Baike = require('../plugins/Baike')
const Constellation = require('../plugins/Constellation')
const HPicture = require('../plugins/HPicture')
const Typhoon = require('../plugins/Typhoon')
const Genshin = require('../plugins/Genshin')
// const Wordcloud = require('../plugins/Wordcloud')
const Test = require('../plugins/Test')
const Job = require('../plugins/Job')
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
            // case '奥运':
            //     await Olympics.doAction(FromGroupId)
            //     break
            // case '#词云':
            //     await Wordcloud.doAction(FromGroupId)
            //     break
            case 'cs':
                //  await Job.yuanPhoto(FromGroupId)
                //  await Job.m_95mm(FromGroupId)
                //  await Job.m_8kcosplay(FromGroupId)
                await Job.zuxingjianArtical(FromGroupId)
                break
            case 'yshd':
                await Genshin.activity(FromGroupId)
                break
        }
        if (FromUserId == 1348200269 && Content.indexOf("#pixiv") == 0) {
            await Test.doAction(Content)
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
        // 写入文件
        // const date = new Date()
        // const s = date.toISOString().split('T')[0]
        // fs.appendFileSync('/data/data/com.termux/files/home/word-' + s + '-' + FromGroupId + '.txt', Content + ',')
    }
})
