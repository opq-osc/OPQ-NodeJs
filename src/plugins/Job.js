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
            // 查库
            const md5 = MD5(url)
            const dbDate = await CRUD.findJob(md5, groupId)
            if (dbDate == null) {
                const data = {
                    'md5': md5,
                    'content': '',
                    'imageUrl': '',
                    'linkUrl': url,
                    'groupId': groupId
                }
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
                await CRUD.saveJob(data)
            }


        })
    },
    zuxingjian(groupId) {
        axios.get('https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=14453048&offset_dynamic_id=0&need_top=1&platform=web')
            .then(async res => {
                const data = res.data.data
                const card = data.cards[0].card
                const dynamicId = data.cards[0].desc.dynamic_id
                const jsonData = JSON.parse(card)
                // 查库
                const md5 = MD5(dynamicId)
                const result = await CRUD.findJob(md5, groupId)
                if (result == null) {
                    let data = {
                        'md5': md5,
                        'content': jsonData.item.description,
                        'imageUrl': '',
                        'linkUrl': '',
                        'groupId': groupId
                    }
                    const pictures = jsonData.item.pictures
                    if (pictures) {
                        console.log(pictures.length);
                        await Api.SendTextMsgV2(groupId, jsonData.item.description)
                        pictures.forEach(async r => {
                            await Api.SendPicMsgV2(groupId, r.img_src, "")
                        });
                        await CRUD.saveJob(data)
                    }
                }
            })
    },
    zuxingjianPhoto(groupId) {
        axios.get('https://api.bilibili.com/x/dynamic/feed/draw/doc_list?page_num=0&page_size=30&biz=all&jsonp=jsonp&uid=14453048')
            .then(async res => {
                const { dyn_id, description, pictures } = res.data.data.items[0]
                // 查库
                const md5 = MD5(Number(dyn_id))
                const result = await CRUD.findJob(md5, groupId)
                if (result == null) {
                    let data = {
                        'md5': md5,
                        'content': description,
                        'imageUrl': '',
                        'linkUrl': '',
                        'groupId': groupId
                    }
                    await Api.SendTextMsgV2(groupId, description)
                    pictures.forEach(async r => {
                        await Api.SendPicMsgV2(groupId, r.img_src, "")
                    });
                    await CRUD.saveJob(data)
                }
            })
    },
    zuxingjianArtical(groupId) {
        axios.get('https://api.bilibili.com/x/space/article?mid=14453048&pn=1&ps=12&sort=publish_time&jsonp=jsonp')
            .then(async res => {
                const id = res.data.data.articles[0].id
                const md5 = MD5(Number(id))
                const result = await CRUD.findJob(md5, groupId)
                if (result == null) {
                    let data = {
                        'md5': md5,
                        'content': '',
                        'imageUrl': '',
                        'linkUrl': '',
                        'groupId': groupId
                    }
                    const url = 'https://www.bilibili.com/read/cv' + id
                    axios.get(url).then(async res => {
                        const $ = cheerio.load(res.data)
                        data.content = $('head > title:nth-child(2)').text()
                        data.linkUrl = url
                        const list = $('#read-article-holder > figure')
                        await Api.SendTextMsgV2(groupId, data.content)
                        list.map(async (k) => {
                            const obj = cheerio.load(list[k])('img')[0].attribs
                            await Api.SendPicMsgV2(groupId, 'https:' + obj['data-src'], '')
                        })
                        await CRUD.saveJob(data)
                    })
                }
            })
    },
    m_95mm(groupId) {
        const page = Math.floor(Math.random() * 30)
        console.log(page)
        // https://www.95mm.net/search/?keywords=cos&append=list-home&paged=2&pos=search&page=2
        axios.get('https://www.95mm.net/search/?keywords=cos&append=list-home&paged=' + page + '&pos=search&page=' + page)
            .then(async res => {
                const html = res.data
                const $ = cheerio.load(html)
                const list = $('#dg_list > div')
                // const { href } = [cheerio.load(list0])('div > div.media > a')[0].attribs
                // console.log(href);
                const result = await Promise.all(
                    list.map((k) => {
                        if (k != list.length - 1) {
                            const url = {}
                            url.href = cheerio.load(list[k])('div > div.media > a')[0].attribs.href
                            numPs = cheerio.load(list[k])('div > div.media > div > span').text()
                            url.num = Number(numPs.substring(0, numPs.lastIndexOf('P')))
                            return url
                        }
                    }).toArray()
                )
                // console.log(result);
                const index = Math.round(Math.random() * result.length)
                const obj = result[index]
                // console.log(obj.num);
                // console.log(obj.href);
                // 查库
                const md5 = MD5(obj.href)
                const dbDate = await CRUD.findJob(md5, groupId)
                if (dbDate == null) {
                    const data = {
                        'md5': md5,
                        'content': '',
                        'imageUrl': '',
                        'linkUrl': obj.href,
                        'groupId': groupId
                    }
                    axios.get(obj.href).then(res => {
                        console.log(res.data);
                        const title = cheerio.load(res.data)('body > main > div > div.d-none.d-md-block.breadcrumbs.mb-3.mb-md-4 > span.current').text()
                        console.log(title);
                        data.content = title
                    })
                    let urls = []
                    for (let i = 1; i <= obj.num; i++) {
                        let url = ''
                        if (i === 1) {
                            url = obj.href
                        } else {
                            url = obj.href.replace('.html', '/' + i + '.html')
                        }
                        // console.log(url);
                        urls.push(url)
                    }
                    console.log(urls.length);
                    urls.forEach(url => {
                        axios.get(url).then(async res => {
                            const html = res.data
                            const $ = cheerio.load(html)
                            const { src } = $('body > main > div > div.row.no-gutters > div > div.post-content > div.post > div > p > a > img')[0].attribs
                            // console.log(src);
                            await Api.SendPicMsgV2(groupId, src, '')
                        })
                    })
                    await CRUD.saveJob(data)
                }
            })
    }
}

module.exports = Jobs

/**
 * {
    "item": {
        "at_control": "",
        "category": "daily",
        "description": "竹行简&质量  动漫美图推荐【552】 \\n点击「转发」立刻永久保存美图[tv_点赞]\\n\\n动态内图片均为互联网整理收集，不会作为商业用途使用。侵权即删致歉（喜欢的作品ID可以通过https:\\/\\/saucenao.com查找作者）\\n#动漫美图##动漫壁纸##壁纸##二次元##动漫##萌妹子##二次元美图##美图##插画##P站搬运##FGO##明日方舟##原神#",
        "id": 144211469,
        "is_fav": 0,
        "pictures": [
            {
                "img_height": 3600,
                "img_size": 7635.96,
                "img_src": "https:\\/\\/i0.hdslb.com\\/bfs\\/album\\/ae1be86697b3bd010ac931d9ed9a29f94c9a5959.png",
                "img_tags": null,
                "img_width": 2525
            }
        ],
        "pictures_count": 9,
        "reply": 0,
        "role": [],
        "settings": {
            "copy_forbidden": "0"
        },
        "source": [],
        "title": "",
        "upload_time": 1625714219
    }
}
 */