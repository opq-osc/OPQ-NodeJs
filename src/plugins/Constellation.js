const https = require('https')
const axios = require('axios')
const cheerio = require('cheerio')
const Api = require('../SendMsg')
const map = new Map([
    ['白羊座', 'aries'],
    ['金牛座', 'taurus'],
    ['双子座', 'gemini'],
    ['巨蟹座', 'cancer'],
    ['狮子座', 'leo'],
    ['处女座', 'virgo'],
    ['天平座', 'libra'],
    ['天蝎座', 'scorpio'],
    ['射手座', 'sagittarius'],
    ['摩羯座', 'capricorn'],
    ['水瓶座', 'aquarius'],
    ['双鱼座', 'pisces']
])
let Constellation = {
    doAction(groupId, content) {
        let keyWord = content.substring(2).trim()
        let flag = false
        for (let item of map.keys()) {
            if (item == keyWord) {
                flag = true
                break
            }
        }
        if (flag) {
            axios.get("https://www.xzw.com/fortune/aries/",{
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false
                })
              }).then(res =>{
                const html = res.data
                try {
                    let $ = cheerio.load(html)
                    let value = []
                    let key = []
                    let title = ''
                    $('#view > div.c_main > div.top > strong').each((index, el) => {
                        title = ($(el).text().replace(/[\n\t]/g, ''))
                    })
                    $('#view > div.c_main > div.c_box > div.c_cont strong').each((index, el) => {
                        key.push('⭐' + $(el).text().replace(/[\n\t]/g, '') + '⭐' + '\n')
                    })
                    $('#view > div.c_main > div.c_box > div.c_cont span').each((index, el) => {
                        value.push($(el).text().replace(/[\n\t]/g, '') + '\n')
                    })
                    let content = ''
                    for (let index in key) {
                        content += key[index] + value[index]
                    }
                    console.log(title + content)
                    Api.SendTextMsg(groupId, title + '\n' + content)
                    // Api.SendPicMsgV2(groupId, title + '\n' + content)
                } catch (e) {
                    console.error(e.message);
                }
            })
        }
    }
}
module.exports = Constellation