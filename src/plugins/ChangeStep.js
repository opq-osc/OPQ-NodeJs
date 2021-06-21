const https = require('https')
const qs = require('querystring');

let ChangeStep = {
    async doAction(stepNum) {
        await getAccess(stepNum)
    }
}

async function getAccess(stepNum) {
    const timestamp = new Date().getTime()
    const accessOption = {
        hostname: 'api-user.huami.com',
        port: 443,
        path: '/registrations/+8615170192271/tokens',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
            'Referer': 'https://api-user.huami.com/registrations/+8615170192271/tokens',
            'User-Agent': 'MiFit/4.6.5 (iPhone; iOS 13.5; Scale/3.00)',
            'Host': 'api-user.huami.com'
        }
    }

    const accessFormData = {
        'client_id': 'HuaMi',
        'country_code': 'CN',
        'password': 'Nokia19971202',
        'redirect_uri': 'https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html',
        'state': 'REDIRECTION',
        't': timestamp,
        'token': 'refresh',
        'token': 'access'
    }
    console.log(qs.stringify(accessFormData));
    // 发送消息
    let req = await https.request(accessOption, async (res) => {
        const location = res.headers['location']
        const url = new URL(location)
        const access = url.searchParams.get('access')
        res.on('data', (chunk) => {
        })
        res.on('end', async () => {
            console.log('响应中已无数据')
            // step 2
            console.log('access:' + access);
            await getAppToken(access, stepNum)
        })
    })
    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`)
    })

    // 将数据写入请求主体。
    req.write(qs.stringify(accessFormData))
    req.end()
}

async function getAppToken(access, stepNum) {

    const appTokenOption = {
        hostname: 'account.huami.com',
        port: 443,
        path: '/v2/client/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
            'Referer': 'https://account.huami.com/v2/client/login',
            'User-Agent': 'MiFit/4.6.5 (iPhone; iOS 13.5; Scale/3.00)',
            'Host': 'account.huami.com'
        }
    }

    const appTokenFormData = {
        'allow_registration': 'false',
        'app_name': 'com.xiaomi.hm.health',
        'app_version': '4.6.5',
        'code': access,
        'country_code': 'CN',
        'device_id': '585F96D3-0DB9-44A4-941E-6C4215FEF346',
        'device_id_type': 'uuid',
        'device_model': 'phone',
        'dn': 'api-user.huami.com,api-mifit.huami.com,app-analytics.huami.com,account.huami.com,api-watch.huami.com,auth.huami.com',
        'grant_type': 'access_token',
        'lang': 'zh_CN',
        'os_version': '1.5.0',
        'source': 'com.xiaomi.hm.health',
        'third_name': 'huami_phone'
    }
    // 发送消息
    let req = await https.request(appTokenOption, async (res) => {
        let data = ''
        // 数据分段 只要接收数据就会触发data事件  chunk：每次接收的数据片段
        res.on('data', (chunk) => {
            data += chunk.toString('utf-8')
        })
        res.on('end', async () => {
            console.log('数据传输完毕！')
            const json = JSON.parse(data)
            const appToken = json.token_info.app_token
            console.log('apptoken:' + appToken);
            await bandData(appToken, stepNum)
        })
    })
    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`)
    })

    // 将数据写入请求主体。
    req.write(qs.stringify(appTokenFormData))
    req.end()
}

async function bandData(appToken, stepNum) {
    const timestamp = new Date().getTime()

    const formData = {
        'userid': '',
        'last_sync_data_time': Math.floor(timestamp / 1000),
        'device_type': 0,
        'last_deviceid': 'DA93188474538E1C',
        'data_json': await getDataJson(stepNum)
    }
    const form = qs.stringify(formData)
    const option = {
        hostname: 'api-mifit-cn2.huami.com',
        port: 443,
        path: '/v1/data/band_data.json?t=' + timestamp,
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'zh-cn',
            'User-Agent': 'python-requests/2.22.0',
            'Content-Length': form.length,
            'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
            'Apptoken': appToken,
            'Referer': 'https://api-mifit-cn2.huami.com/v1/data/band_data.json?&t=' + timestamp,
            'Connection': 'Keep-Alive',
            'Host': 'api-mifit-cn2.huami.com'
        }
    }

    // 发送消息
    let req = https.request(option, (res) => {
        let data = ''
        // 数据分段 只要接收数据就会触发data事件  chunk：每次接收的数据片段
        res.on('data', (chunk) => {
            data += chunk.toString('utf-8')
        })
        res.on('end', () => {
            console.log('数据传输完毕！')
            const json = JSON.parse(data)
            console.log(json);
        })
    })
    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`)
    })

    // console.log(form);

    // 将数据写入请求主体。
    req.write(form)
    req.end()

}

async function getDataJson(stepNum) {
    console.log('stepNum:' + stepNum);
    const summary = {
        "sn": "28ba7cf074e8",
        "slp": {
            "ss": 0,
            "lt": 0,
            "dt": 0,
            "st": 1615564800,
            "lb": 0,
            "dp": 0,
            "is": 0,
            "rhr": 0,
            "stage": [

            ],
            "ed": 1615564800,
            "wk": 0,
            "wc": 0
        },
        "stp": {
            "runCal": 0,
            "cal": 1,
            "conAct": 0,
            "stage": [

            ],
            "ttl": stepNum,
            "dis": 1,
            "rn": 0,
            "wk": 1,
            "runDist": 0,
            "ncal": 0
        },
        "tz": "28800",
        "v": 6,
        "goal": 30000
    }
    const json = [
        {
            "data_hr": "",
            "date": new Date().toLocaleDateString().split('/').join('-'),
            "summary": JSON.stringify(summary),
            "data": [
                {
                    "stop": 1439,
                    "value": "fgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfv8Afv8Afv8Afv8CfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAAfgAA",
                    "did": "DA93188474538E1C",
                    "tz": 0,
                    "src": 7,
                    "start": 0
                }
            ]
        }
    ]

    const data = encodeURIComponent(JSON.stringify(json))
    console.log(data);
    return data
}


module.exports = ChangeStep


