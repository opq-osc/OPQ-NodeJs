const Api = require('../SendMsg')
const { createCanvas, registerFont, loadImage } = require('canvas')
registerFont('./src/utils/fonts/TechnoHideo.ttf', { family: 'Comic Sans' })
const canvas = createCanvas(350, 100)
const ctx = canvas.getContext('2d')

let NewUser = {
	doAction(groupId, userId, code) {
		try {
			ctx.font = '65px "Comic Sans"'
			setTimeout(() => {
				loadImage('./src/utils/background.png').then((image) => {
					ctx.drawImage(image, 0, 0, 350, 100)
					ctx.fillText(code, 10, 70)
					ctx.beginPath()
					ctx.stroke()
				})
			}, 1000)
			setTimeout(() => {
				const base64 = canvas.toDataURL().replace("data:image/png;base64,", "")
				Api.SendPicMsgWithAtAndBaseBuf(groupId, userId, base64)
			}, 2000)
		} catch (e) {
			console.error(e.message);
		}

	}
}
module.exports = NewUser
