const Api = require('../SendMsg')

let Welcome = {
	get(groupId,userId) {
		try {
			// 40000 正常
			// 40001 幻影
			// 40002 抖动
			// 40003 生日
			// 40004 爱你
			// 40005 征友
			console.log(userId)
			const type = ["[秀图40000]","[秀图40001]","[秀图40002]","[秀图40003]","[秀图40004]","[秀图40005]"]
			const index = Math.floor(Math.random() * 6)
			console.log(type[index])
			const url = 'http://q1.qlogo.cn/g?b=qq&nk='+userId+'&s=640'
			Api.SendPicMsg(groupId,url,type[index])
		} catch (e) {
			console.error(e.message);
		}
        
	}
}
module.exports = Welcome
