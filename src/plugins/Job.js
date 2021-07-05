const Api = require('../SendMsg')
const axios = require('axios')
const CRUD = require('./mongodb/crud')
const cheerio = require('cheerio')
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
    },
    m_8kcosplay(groupId) {
        axios.get('https://www.8kcosplay.com/').then(async res => {
            // console.log(res.data)
            const $ = cheerio.load(res.data)
            const list = $('#wrap > div.wrap.container > main > section.sec-panel.main-list > ul.post-loop.post-loop-default.tab-wrap.active > li')
            // let { href } = cheerio.load(list[0])('div.item-content > h2 > a')[0].attribs
            // console.log(href);
            const result = await Promise.all(
                list.map((k) => {
                    // console.log(k);
                    if (k != list.length - 1) {
                        const { href } = cheerio.load(list[k])('div.item-content > h2 > a')[0].attribs
                        return href
                    }

                }).toArray()
            )
            console.log(result.length);
            //  https://images.free4.xyz/images/2021/07/05/tpj6y.jpg
            const index = Math.floor(Math.random() * 29)
            const url = result[index]
            axios.get(url).then(async res => {
                const a = res.data.toString()
                const id = a.substring(a.indexOf('<article') + 13, a.indexOf('<article') + 23)
                const $ = cheerio.load(res.data)
                // #post-10090 > div > div.entry-content > p >a
                const list = $('#' + id + ' > div > div.entry-content > p >a > img')

                list.map(async (k) => {
                    const alt = list[k].attribs.alt.split('.')
                    const img = 'https://images.free4.xyz/images/' + url.substring(26, 36) + '/' + alt[0] + '.' + alt[2]
                    console.log(img);
                    await Api.SendPicMsgV2(groupId, img, '')

                })
            })

        })
    }
}

module.exports = Jobs
