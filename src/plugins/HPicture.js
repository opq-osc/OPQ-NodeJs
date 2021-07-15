const Api = require('../SendMsg')
const Pixiv = require('./mongodb/Pixiv');
const https = require('https');
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
    if (reg) {
        reg = new RegExp(reg) //模糊查询参数
        Pixiv.find({ tags: reg }, (err, res) => {
            console.log("Tag:" + res.length)
            if (err) {
                console.log(err)
                return
            } else if (res.length === 0) {
                Pixiv.find({ "author.name": reg }, (err, res) => {
                    console.log("Author.Name:" + res.length)
                    if (err) {
                        console.log(err)
                        return
                    } else if (res.length === 0) {
                        nothing(groupId)
                        return
                    } else {
                        pic(groupId, res, num)
                        return
                    }
                })
            } else {
                pic(groupId, res, num)
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
    console.log('num----->', num);
    for (let i = 0; i < num; i++) {
        const index = Math.floor((Math.random() * res.length))
        console.log('index:' + index);
        let url = res[index].url
        console.log(url)
        sendPic(groupId, url)
    }
}

function sendPic(groupId, url) {
    url = url.replace("i.pximg.net", "i.pixiv.cat")
    https.get(url, function (res) {
        var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
        var size = 0;　　 //保存缓冲数据的总长度
        res.on('data', function (chunk) {
            chunks.push(chunk);
            //累加缓冲数据的长度
            size += chunk.length;
        });
        res.on('end', function (err) {
            //Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
            var data = Buffer.concat(chunks, size);
            //可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
            console.log(Buffer.isBuffer(data));
            //将Buffer对象转换为字符串并以base64编码格式显示
            const base64Img = data.toString('base64');
            Api.SendPicMsgWithBase64(groupId, base64Img)
        });
    });
}

module.exports = HPicture
