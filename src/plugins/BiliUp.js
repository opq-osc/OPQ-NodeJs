const Api = require('../SendMsg')
const axios = require('axios')
const CRUD = require('./mongodb/crud')
const searchUrl = 'https://api.bilibili.com/x/web-interface/search/type?search_type=bili_user&keyword='
const videoUrl = 'https://api.bilibili.com/x/space/arc/search?ps=1&mid='
let searchResult = new Map()
let list = []
let BiliUp = {
    searchUp(groupId, keyWord) {
        axios.get(searchUrl + encodeURI(keyWord))
            .then(res => {
                const result = res.data.data.result
                let message = ''
                let num = 0;
                result.forEach(e => {
                    if (num === 3) {
                        return
                    }
                    const desc = e.official_verify.desc
                    const a = desc.length > 0 ? desc : '没有描述'
                    message += num + 1 + '、' + e.uname + '：' + a + '\n'
                    let up = {
                        "groupId": groupId,
                        "mid": e.mid,
                        "uname": e.uname,
                        "usign": e.usign,
                        "upic": e.upic,
                        "desc": e.desc
                    }
                    searchResult.set(groupId + num + 1, up)
                    num++;
                });
                Api.SendTextMsgV2(groupId, message + '若要订阅，请发送: up订阅+序号\n例如: up订阅2')
            })
            .catch(error => {
                console.log(error);
            });
    },
    async subscribeUp(groupId, no) {
        no = Number.parseInt(no)
        let message = ''
        if (searchResult.get(groupId + no) != null) {
            message = await CRUD.save(searchResult.get(groupId + no))
            // 重置
            searchResult.clear()
        } else {
            message = '输入错误！'
        }
        Api.SendTextMsgV2(groupId, message)
    },
    async listUps(groupId) {
        const result = await CRUD.listByGroupId(groupId)
	console.log(result)
        let message = ''
        if (result.length > 0) {
            list = result
            let no = 0;
            result.forEach(e => {
                message += no + 1 + '、' + e.uname + '\n'
                no += 1
            })
            message += '若要取消订阅，请发送: 取消订阅+序号\n例如: 取消订阅23'
        } else {
            message = '本群暂无订阅！'
        }

        Api.SendTextMsgV2(groupId, message)
    },
    async unSubscribeUp(groupId, no) {
        no = Number.parseInt(no)
        let message = ''
        console.log('list.length-----------> ' + list.length);
        if (list.length > 0 && no <= list.length && no > 0) {
            const success = CRUD.delete(list[no - 1])
            console.log('success-----------> ' + success);
            // 重置
            list = []
            if (success) {
                message = '取关成功！'
            }
        } else {
            message = '序号不存在！请重新输入！'
        }
        Api.SendTextMsgV2(groupId, message)
    },
    async pushNews() {
        // 1. 获取全部up
        let mids = await CRUD.listMid()
        // await CRUD.listMid().then(res => {
        //     mids = res
        // })
        // 2. 根据mid 分组

        if (mids.length > 0) {
            // 3. 检查是否有新动态
            // await getMap(mids).then(async res => {
            //     // const pushMid = res
            //     console.log('object');
            //     console.log(res)
            //     // await pushMessage(pushMid)
            // })
            await getMap(mids)

        }

        // axios.get(videoUrl + )
    }

}

async function getVideoInfo(mid) {
    return axios.get(videoUrl + mid).then(res => {
        return res.data.data.list.vlist
    })
}

async function getMap(mids) {
    let pushMid = new Map()
    let count = 0
    mids.forEach(async mid => {
        count++
        let videoInfo = await getVideoInfo(mid)
        videoInfo = videoInfo[0]
        if (videoInfo != null) {
            const res = await CRUD.findByBvid(videoInfo.bvid)
            // console.log('res')
            // console.log(res)
            if (res == null) {
                // 发送消息并保存
                const info = {
                    'mid': videoInfo.mid,
                    'title': videoInfo.title,
                    'desc': videoInfo.description,
                    'pic': videoInfo.pic,
                    'bvid': videoInfo.bvid,
                    'author': videoInfo.author
                }
                await CRUD.insert(info)
                const content = {
                    'message': "UP主" + videoInfo.author + "发布了新视频!\n" + videoInfo.title + "\n" + videoInfo.description +"\n" + "https://www.bilibili.com/video/" + info.bvid ,
                    'picUrl': videoInfo.pic
                }

                pushMid.set(mid, content)

            }
        }

    })
    setTimeout(() => {
        pushMessage(pushMid)
    }, 3000)
}

async function pushMessage(pushMid) {
    let result = await CRUD.listAll()
    if (result.length > 0) {
        const lastData = arrayGroupBy(result, 'mid');
        // console.log(lastData)
        // console.log(pushMid)
        pushMid.forEach((value, key) => {
            lastData[key].forEach(item => {
                // console.log(item.groupId, value.picUrl, value.message)
                Api.SendPicMsgV2(item.groupId, value.picUrl, value.message)
            })
        })

    }
}

function arrayGroupBy(list, groupId) {
    function groupBy(array, f) {
        const groups = {}
        array.forEach(function (o) {
            const group = JSON.stringify(f(o))
            groups[group] = groups[group] || []
            groups[group].push(o)
        })

        return groups
        // return Object.keys(groups).map(function (group) {
        //     return groups[group]
        // })
    }
    return groupBy(list, function (item) {
        return item[groupId]
    })
}

module.exports = BiliUp
