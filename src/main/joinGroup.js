const random = require('string-random')
const socket = require('../Socket').getSocket()
const Api = require('../SendMsg')
const NewUser = require('../plugins/NewUser')
const Welcome = require('../plugins/Welcome')
let NewUsers = new Map()

socket.on('OnEvents', async data => {
    console.log('>>OnEvents', JSON.stringify(data, null, 2))
    const { EventData, EventName, EventMsg } = data.CurrentPacket.Data
    const userId = EventData.UserID
    const groupId = EventMsg.FromUin
    if (EventName == 'ON_EVENT_GROUP_JOIN' && groupId != '757360354') {
        const code = random(6, { letters: false })
        NewUsers.set(userId, code)
        console.log(NewUsers)
        await NewUser.doAction(groupId, userId, code)
        setTimeout(() => {
            if (NewUsers.has(userId)) {
                // 踢人
                Api.SendTextMsg(groupId, "[ATUSER(" + userId + ")]由于您没有及时验证，将立即将你移除该群！")
                setTimeout(() => { Api.RemoveAway(groupId, userId) }, 5000)
            }
        }, 1000 * 60 * 3)
    }
})


socket.on('OnGroupMsgs', async data => {
    let { FromGroupId, FromUserId, Content, MsgType } = data.CurrentPacket.Data
    if (MsgType == 'TextMsg') {
        if (NewUsers.get(FromUserId) == Content) {
            await Welcome.doAction(FromGroupId, FromUserId)
            NewUsers.delete(FromUserId)
        }
        if (NewUsers.has(FromUserId) != null && Content == '看不清') {
            const code = random(6, { letters: false })
            NewUsers.set(FromUserId, code)
            console.log(NewUsers)
            await NewUser.doAction(FromGroupId, FromUserId, code)
        }
    }
})