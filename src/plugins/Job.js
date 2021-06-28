const Api = require('../SendMsg')
const axios = require('axios')
const CRUD = require('./mongodb/crud')
const MD5 = require('md5')
let Jobs = {
    yuanshen(groupId) {
        axios.get("https://ys.mihoyo.com/content/ysCn/getContentList?pageSize=5&pageNum=1&channelId=10").then(async res => {
            const { contentId, title, ext } = res.data.data.list[0]
            hasPicUrl = ext[1].value.length > 0
            const message = title + '\n' + 'https://ys.mihoyo.com/main/news/detail/' + contentId
            // 查库
            const md5 = MD5(contentId)
            const result = await CRUD.findJob(md5, groupId)
            if (result == null) {
                let data = {
                    'md5': md5,
                    'content': message,
                    'imageUrl': '',
                    'linkUrl': 'https://ys.mihoyo.com/main/news/detail/' + contentId,
                    'groupId': groupId
                }
                if (hasPicUrl) {
                    const PicUrl = ext[1].value[0].url
                    data.imageUrl = PicUrl
                    await Api.SendPicMsgV2(groupId, PicUrl, message)
                } else {
                    await Api.SendTextMsg(groupId, message)
                }
                await CRUD.saveJob(data)
            }

        })
    }
}

module.exports = Jobs
