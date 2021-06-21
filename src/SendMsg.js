const http = require('http')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./config/opqConfig.json'))
const Authorization = 'Basic ' + Buffer.from(config.USER + ':' + config.PASS).toString('base64')

let Api = {
    // 发送文本消息
    SendTextMsg(groupId, message) {
        const bodyData = {
            "toUser": groupId,
            "sendToType": 2,
            "sendMsgType": "TextMsg",
            "content": message,
            "groupid": 0,
            "atUser": 0
        }
        doAction(JSON.stringify(bodyData), 'SendMsg')
    },
    SendTextMsgV2(groupId, message) {
        const bodyData = {
            "ToUserUid": groupId,
            "SendToType": 2,
            "SendMsgType": "TextMsg",
            "Content": message
        }
        doAction(JSON.stringify(bodyData), 'SendMsgV2')
    },
    // 发送图片消息
    SendPicMsg(groupId, picUrl, message) {
        const bodyData = {
            "toUser": groupId,
            "sendToType": 2,
            "sendMsgType": "PicMsg",
            "content": message,
            "groupid": 0,
            "atUser": 0,
            "picUrl": picUrl
        }
        doAction(JSON.stringify(bodyData), 'SendMsg')
    },
    SendPicMsgWithBase64(groupId, base64Buf) {
        const bodyData = {
            "toUser": groupId,
            "sendToType": 2,
            "sendMsgType": "PicMsg",
            "content": "",
            "groupid": 0,
            "atUser": 0,
            "picUrl": '',
            "picBase64Buf": base64Buf,
            "fileMd5": ""
        }
        doAction(JSON.stringify(bodyData), 'SendMsg')
    },
    SendPicMsgWithAtAndBaseBuf(groupId, userId, base64Buf) {
        const bodyData = {
            "toUser": groupId,
            "sendToType": 2,
            "sendMsgType": "PicMsg",
            "content": "[ATUSER(" + userId + ")]请10分钟内验证！,看不清请回复：看不清",
            "groupid": 0,
            "picBase64Buf": base64Buf
        }
        doAction(JSON.stringify(bodyData), 'SendMsgV2')
    },
    SendPicMsgV2(groupId, picUrl, content) {
        const bodyData = {
            "ToUserUid": groupId,
            "SendToType": 2,
            "SendMsgType": "PicMsg",
            "Content": content,
            "PicUrl": picUrl
        }
        doAction(JSON.stringify(bodyData), 'SendMsgV2')
    },
    // 发送语言消息
    SendVoiceMsg(groupId, voiceUrl) {
        const bodyData = {
            "toUser": groupId,
            "sendToType": 2,
            "sendMsgType": "VoiceMsg",
            "content": "",
            "groupid": 0,
            "atUser": 0,
            "voiceUrl": voiceUrl,
            "voiceBase64Buf": ""
        }
        doAction(JSON.stringify(bodyData), 'SendMsg')

    },
    SendVoiceMsgv2(groupId, voiceUrl) {
        const bodyData = {
            "ToUserUid": groupId,
            "SendToType": 2,
            "SendMsgType": "VoiceMsg",
            "VoiceUrl": voiceUrl
        }
        doAction(JSON.stringify(bodyData), 'SendMsgV2')

    },
    // 撤回消息
    RevokeMsg(groupId, msgSeq, msgRandom) {
        const bodyData = {
            "GroupID": groupId,
            "MsgSeq": msgSeq,
            "MsgRandom": msgRandom
        }
        doAction(JSON.stringify(bodyData), 'RevokeMsg')
    },
    // 踢人
    RemoveAway(groupId, userId) {
        const bodyData = {
            "ActionType": 3,
            "GroupID": groupId,
            "ActionUserID": userId,
            "Content": ""
        }
        doAction(JSON.stringify(bodyData), 'GroupMgr')
    }
}

// 发送请求
function doAction(bodyData, funcname) {
    // 构建请求体
    const options = {
        hostname: config.HOST,
        port: config.PORT,
        path: config.URI + 'qq=' + config.QQ + '&funcname=' + funcname + '&timeout=30',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Authorization
        }
    }
    // 发送消息
    let req = http.request(options, (res) => {
        res.on('data', (chunk) => {
        })
        res.on('end', () => {
            console.log('响应中已无数据')
        })
    })

    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`)
    })

    // 将数据写入请求主体。
    req.write(bodyData)
    req.end()
}

module.exports = Api
