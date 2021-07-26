const Api = require('../SendMsg')
const puppeteer = require('puppeteer')
const fs = require('fs')
let Olympics = {
    async doAction(groupId) {
        const browser = await puppeteer.launch({
            headless: true,
            devtools: false,
            ignoreDefaultArgs: ["--enable-automation"],
            args: ['--no-sandbox']
        });
        try {
            const page = await browser.newPage();
            await page.goto('https://tiyu.baidu.com/tokyoly/home/tab/%E5%A5%96%E7%89%8C%E6%A6%9C/from/pc', {
                waitUntil: 'networkidle0'
            });
            await page.setViewport({
                width: 1920,
                height: 1080
            });
            //获取页面Dom对象
            let body = await page.$('body');
            //调用页面内Dom对象的 screenshot 方法进行截图
            await body.screenshot({
                path: 'olympics.png'
            });
            const imageData = fs.readFileSync('olympics.png');
            const imageBase64 = imageData.toString("base64");
            Api.SendPicMsgWithBase64(groupId, imageBase64)
            await browser.close();
        } catch (e) {
            await browser.close()
            throw e
        }
    }
}

module.exports = Olympics
