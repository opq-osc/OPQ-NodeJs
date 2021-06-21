const Api = require('../SendMsg')
let RevokeMsg = {
    doAction(groupId, msgSeq, msgRandom) {
        try {
            Api.RevokeMsg(groupId, msgSeq, msgRandom)
        } catch (e) {
            console.error(e.message);
        }
    }
}
module.exports = RevokeMsg
