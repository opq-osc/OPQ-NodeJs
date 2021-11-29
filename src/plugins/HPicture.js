const Api = require('../SendMsg')
const Pixiv = require('./mongodb/Pixiv');
const https = require('https');
const axios = require('axios')
let HPicture = {
    doAction(groupId, arr) {
        console.log('arr:' + arr)
        if (arr[1]) {
            let num = Number(arr[1])
            console.log('num: ' + num)
            if (num && num <= 3) {
                if (arr[2]) {
                    findPic(groupId, arr[2], num)
                } else {
                    findPic(groupId, false, num)
                }
            }

        }
    }
}

function findPic(groupId, reg, num) {
    console.log("reg: " + reg);
    let len = num;
    if (reg) {
        reg = new RegExp(reg) //模糊查询参数
        Pixiv.find({ tags: reg }, (err, res) => {
            console.log("Tag:" + res.length)
	    len = num > res.length ? res.length : num;
            if (err) {
                console.log(err)
                return
            } else if (res.length === 0) {
                Pixiv.find({ "author.name": reg }, (err, res) => {
                    console.log("Author.Name:" + res.length)
		    len = num > res.length ? res.length : num;
                    if (err) {
                        console.log(err)
                        return
                    } else if (res.length === 0) {
                        nothing(groupId)
                        return
                    } else {
                        pic(groupId, res, len)
                        return
                    }
                })
            } else {
                pic(groupId, res, len)
            }
        })
    } else {
        nothing(groupId)
    }
}

function nothing(groupId) {
    Api.SendTextMsgV2(groupId, "未收录该系列插画！将随机发送三张插画")
    Pixiv.find({}).countDocuments().exec((err, res) => {
        console.log('总数据：', res);
        for (let index = 0; index < 3; index++) {
            const index = Math.floor((Math.random() * res))
            console.log(index);
            Pixiv.find({}).skip(index - 1).limit(1).exec((err, res) => {
                sendPic(groupId, res[0].url)
            })
        }
    })
}

function pic(groupId, res, num) {
    console.log('num----->', res.length);
    const indexs = getIndex(res, num)
    console.log(indexs);
    for (let index = 0; index < indexs.length; index++) {
        const element = indexs[index];
        let url = res[element].url
        console.log(url)
        sendPic(groupId, url)
    }
    // for (let i = 0; i < num; i++) {
    //     const index = Math.floor((Math.random() * res.length))
    //     console.log('index:' + index);
    //     let url = res[index].url
    //     console.log(url)
    //     sendPic(groupId, url)
    // }
}

function getIndex(res, num) {
    let arr = [];
    for (var i = 0; i < num; i++) {
        const arrNum = Math.floor((Math.random() * res.length))
        let flag = true;
        for (let j = 0; j <= arr.length; j++) {
            if (arrNum == arr[j]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            arr.push(arrNum);
        } else {
            i--;
        }
    }
    return arr
}

async function sendPic(groupId, url) {
    // url = url.replace("i.pximg.net", "i.pixiv.cat")
    url = url.replace("i.pximg.net", "i-cf.pximg.net")
    // const option =
    // {
    //     headers: { referer: 'https://www.pixiv.net/' },
    //     timeout: 30000,
    //     responseType: 'arraybuffer'
    // }
    // const base64Img = await axios.create(option).get(url).then(res => {
    //     return new Buffer.from(res.data, 'binary').toString('base64')
    // })
    // Api.SendPicMsgWithBase64(groupId, base64Img)
    Api.SendPicMsg(groupId, url, "")

}

module.exports = HPicture
