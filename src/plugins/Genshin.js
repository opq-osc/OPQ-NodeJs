const axios = require('axios')
const { createCanvas, loadImage } = require('canvas')
const Api = require('../SendMsg')
const moment = require('moment')

const activityUrl = 'https://hk4e-api.mihoyo.com/common/hk4e_cn/announcement/api/getAnnList?game=hk4e&game_biz=hk4e_cn&lang=zh-cn&bundle_id=hk4e_cn&platform=pc&region=cn_gf01&level=55&uid=100000000'
let History = {
    activity(groupId) {
        axios.get(activityUrl).then((r) => {
            const dataList = r.data.data.list[1].list
            const canvas = createCanvas(800, dataList.length * 30 + 10)
            const ctx = canvas.getContext('2d')
            ctx.font = '18px Impact'
           
            setTimeout(() => {
				loadImage('./src/utils/background.png').then((image) => {
					ctx.drawImage(image, 0, 0, 800, dataList.length * 30 + 10)
                    for (let index = 0; index < dataList.length - 1; index++) {
                        const r = dataList[index];
                        let diffDay = moment(r.end_time).diff(moment(r.start_time), 'days');
                        ctx.fillText(r.title + '  剩余' + diffDay + '天', 10, 30 * (index + 1))
                    }
					ctx.beginPath()
					ctx.stroke()
				})
			}, 1000)

            setTimeout(() => {
				const base64 = canvas.toDataURL().replace("data:image/png;base64,", "")
				Api.SendPicMsgWithBase64(groupId, base64)
			}, 2000)
        })
    }
}
module.exports = History


