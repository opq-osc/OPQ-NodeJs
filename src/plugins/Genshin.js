const axios = require('axios')
const { createCanvas, loadImage } = require('canvas')
const Api = require('../SendMsg')
const moment = require('moment')
const exec = require('child_process').exec
const fs = require('fs')

const activityUrl = 'https://hk4e-api.mihoyo.com/common/hk4e_cn/announcement/api/getAnnList?game=hk4e&game_biz=hk4e_cn&lang=zh-cn&bundle_id=hk4e_cn&platform=pc&region=cn_gf01&level=55&uid=100000000'
let Genshin = {
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
                        let now = moment().format('YYYY-MM-DD HH:mm:ss');
                        let diffDay = moment(r.end_time).diff(moment(now), 'days');
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
    },
    search(groupId, content) {
        const uid = content.split(':')[1]
        if (uid.length == 9) {
            const cmdStr = 'python3 /home/ubuntu/python/YuanShen_User_Info/ys_UserInfoGet.py ' + uid;
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    console.log('error:' + stderr);
                    const a = stderr.split('RuntimeError: ')
                    // console.log(a[1]);
                    Api.SendTextMsgV2(groupId,a[1])
                } else {
                    // console.log(stdout);
                    // let info = fs.readFileSync('');
                    // info = info.toString()
                    // console.log(info);
                    // await Api.SendTextMsgV2(groupId, info)
                    setTimeout(() => {
                        fs.readFile('/home/ubuntu/python/YuanShen_User_Info/info.txt', async (err, data) => {
                            if (err) throw err;
                            info = data.toString()
                            console.log(info);
                            await Api.SendTextMsgV2(groupId, info)
                        });
                    }, 3000)
                }
            });
        }

    }
}
module.exports = Genshin


