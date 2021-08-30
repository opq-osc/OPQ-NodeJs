const Pixiv = require('../pxder/index');
const config = Pixiv.readConfig();
const Api = require('../SendMsg')
let Wordcloud = {
    async doAction(Content) {

        // 检查配置
        if (!Pixiv.checkConfig(config)) {
            this.sendError(GroupId, '检查Pixiv配置失败')
            return
        }
        Pixiv.applyConfig(config);
        // 重登陆
        const pixiv = new Pixiv();
        await pixiv.relogin();

        // #pixiv:u:111 作者uid
        // #pixiv:p:12312  插画pid
        // #pixiv:b  收藏插画
        // #pixiv:f  收藏画师
        const key = Content.split(':')
        if (key[1] == 'u') {
            uids = key[2].split(',');
            await pixiv.downloadByUIDs(uids);
        }
        if (key[1] == 'p') {
            pids = key[2].split(',');
            await pixiv.downloadByPIDs(pids);
        }
        if (key[1] == 'b') {
            await pixiv.downloadBookmark();
        }
        if (key[1] == 'f') {
            await pixiv.downloadFollowAll(false, false);
        }
    }
}

module.exports = Wordcloud