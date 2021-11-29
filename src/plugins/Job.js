const Api = require('../SendMsg')
const axios = require('axios')
const CRUD = require('./mongodb/crud')
const cheerio = require('cheerio')
const MD5 = require('md5')
const urls = [
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/1f62425cec6ffc21ecf4c8f0da499ac7_4928089850342437737.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/80905774b30aaa4b26a5b75926dcf7b3_222995534350028202.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/58b24db38da079a9230e37d741b940c3_7709490267389090600.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/3df9ee03bc4629e6e2af3c7225674543_2742734744870268629.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/95c9ef420173047f635e963db2dae3f6_5948753857591750018.png',
    'https://webstatic.mihoyo.com/upload/event/2021/01/05/f486f444ebe67ebdb70307433aa08fd3_8750695094071258948.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/4165b7cb43e3369a279ccef46c295769_3879970605580805258.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/08aa6011f26df790dbf2681678f1d7e9_2796140925707265189.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/ca72b6a24f48ef04796e3c63a7c25163_5778250222995475858.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/160b860e2968c0a930373bf74dbe34a6_6782336143409269316.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/b11c93805674e62fc43a9adceaa8e893_8926566513833977124.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/bd6894fa5c5daa833b4eede40cf01385_2519521084432177379.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/20ae5d9e7ea88ee27dd02208714e622e_2311908118844083107.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/d19849df8be15bff53cdc0a0146f534a_1468443590902001424.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/051cb060351937831252e395f65834c8_6289474038603880117.png',
    'https://webstatic.mihoyo.com/upload/event/2020/09/27/ad7183031224452a2894b9516fd571ad_3529083730481381114.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/1f80b78033c55c31553d2fba2201c857_8778762270527512136.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/4bb5924e073f073f400389da2062407f_4225300656656631729.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/e4a7ff004ee5d04678add5bb7c3c5fd9_506219715714537000.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/0ad6dd1e9903507a659df257959a763f_2854888966169652134.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/3a6f0d284e2ab862c82ee3a07d6ffbc7_7794570330643971174.png',
    'https://webstatic.mihoyo.com/upload/event/2020/09/27/1761487a5da1ea037be6ae80d24e1423_9220243684814419617.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/da669761dcbd5c029bda0a62bccb301e_8046604345851128002.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/a105a4aca30bdf8348519140736c306d_5118343542859881269.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/b120c4ac7c695d3aaf55441eb43600d1_4487729736509862376.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/c11a5c5c90d54c98f10c6f257e8eac01_6529728627802398273.png',
    'https://webstatic.mihoyo.com/upload/event/2020/11/16/f975f0e6311346306e5151f04fbbbc0a_6762294099269212599.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/b45dd906708dbd5ceff7960bd48baab7_605993513095277023.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/c75eb06e4d0b7856652c9893af2da63e_5411923475027982287.png',
    'https://webstatic.mihoyo.com/upload/event/2020/11/16/40e0bc9a555fcbbbdfb74a95d2e387ef_8519449231927106780.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/837fc37bd0831b74c0281c945d5323da_4271787076408799417.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/4d25ea66387705c7360ea6d5cc90bb01_4560335127797724868.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/b9920d1400bf55a2307b9b2e216a4a8e_2000240380863580838.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/8d4d7f176808b85529d5e53f9ef59eb3_873542905371029363.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/e17547277f4dfb7bc96f764536b19406_3629575916992344590.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/b373e3bcb24285b96fd106747c9be482_2380875567755087743.png',
    'https://webstatic.mihoyo.com/upload/event/2021/01/12/745fc70073f22a37bb0238a06a53cfdb_1162143275141578017.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/9cefb9bd9811f166bf14b8367dc785df_3763750909505644121.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/997dca7a05c35b09881b19c08e265477_1299947423447392337.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/34bde2a566136897ab22932a9001d572_4843575850627066457.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/c23a633e2eb72a10fb51198550d59a8a_542776791456547653.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/315f96761caa9b22993180d529e6c935_169150677634938584.png',
    'https://webstatic.mihoyo.com/upload/event/2020/11/16/04b40cd1a848577f9cde336a3039c750_3996605459102489069.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/15e08973b2d2896bb403f1f5f7499382_1462646223869539529.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/e05c2fe7d9ab737a25285c060aab1aa0_2111907448530751567.png',
    'https://webstatic.mihoyo.com/upload/event/2020/11/16/0530db8dbacbebf662c3b4cad1f407c8_7326500760952263133.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/645cf32a7a133b57605bb341a84d65a2_7809384165096554836.png',
    'https://webstatic.mihoyo.com/upload/event/2021/01/05/929f01ef0b7db16e6e3289e6f09bc664_3314543116725683931.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/9a477826d4587eaafa7161507e53cec1_3070825784718745991.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/9c1e67747a78b5e22ae3834814c57a8f_6116180424455008670.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/a46cccf622c2d4dbff6c5353b936eee4_1652272197678612672.png',
    'https://webstatic.mihoyo.com/upload/event/2020/08/31/378f274d1f40a840c14da114f97c689d_6631287774563316092.png'
]
let indexs = []
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
                   // await Api.SendPicMsgV2(groupId, PicUrl, message)
                   await Api.SendPicMsg(groupId, PicUrl, message)
                } else {
                    await Api.SendTextMsg(groupId, message)
                }
                await CRUD.saveJob(data)
            }

        })
    },
    m_8kcosplay(groupId) {
	console.log(11111111111)
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
            // console.log(result.length);
            //  https://images.free4.xyz/images/2021/07/05/tpj6y.jpg
            const index = Math.floor(Math.random() * 29)
	    console.log(index)
	    console.log(result)
            const url = result[index]
            console.log(url);
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
                        const img = list[k].attribs['data-original'].replace('.th','')
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
                        await Api.SendTextMsg(groupId, jsonData.item.description)
                        pictures.forEach(async r => {
                            await Api.SendPicMsg(groupId, r.img_src, "")
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
                    await Api.SendTextMsg(groupId, description)
                    pictures.forEach(async r => {
                        await Api.SendPicMsg(groupId, r.img_src, "")
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
                        data.content = $('#app > div > div.article-container > div.article-container__content > div.title-container > h1').text()
                        data.linkUrl = url
                        const list = $('#read-article-holder > figure')
                        await Api.SendTextMsg(groupId, data.content)
                        list.map(async (k) => {
                            const obj = cheerio.load(list[k])('img')[0].attribs
                            await Api.SendPicMsg(groupId, 'https:' + obj['data-src'], '')
                        })
                        await CRUD.saveJob(data)
                    })
                }
            })
    },
    m_95mm(groupId) {
        const page = Math.floor(Math.random() * 30)
        console.log("page--->",page)
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
                            console.log(url);
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
                    await axios.get(obj.href).then(res => {
                        const title = cheerio.load(res.data)('body > main > div > div.d-none.d-md-block.breadcrumbs.mb-3.mb-md-4 > span.current').text()
                        console.log("title--->",title);
                        data.content = title
                    })
                    console.log(data);
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
                    urls.forEach(url => {
                        axios.get(url).then(async res => {
                            const html = res.data
                            const $ = cheerio.load(html)
                            const { src } = $('body > main > div > div.row.no-gutters > div > div.post-content > div.post > div > p > a > img')[0].attribs
                            console.log(src);
                            await Api.SendPicMsgV2(groupId, src, '')
                        })
                    })
                    await CRUD.saveJob(data)
                }
            })
    },
    yuanPhoto(groupId) {
        let index = Math.floor((Math.random() * urls.length))
        console.log(indexs)
        while (indexs.length != 0 && indexs.indexOf(index) > -1) {
            index = Math.floor((Math.random() * urls.length))
        }
        indexs.push(index)
        if(indexs.length == urls.length){
            indexs = []
        }
        Api.SendPicMsgV2(groupId, urls[index], '')
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
