const { createCanvas, registerFont, loadImage } = require('canvas')
registerFont('./Plugins/utils/fonts/TechnoHideo.ttf', { family: 'Comic Sans' })
const canvas = createCanvas(350, 100)
const ctx = canvas.getContext('2d')

let verifyCode = {
    create(Code) {
        console.log(Code);
        ctx.font = '65px "Comic Sans"'
        loadImage('./Plugins/utils/background.png').then((image) => {
            ctx.drawImage(image, 0, 0, 350, 100)
            ctx.fillText('222222', 10, 70)
            ctx.beginPath()
            ctx.stroke()
            // console.log('<img src="' + canvas.toDataURL() + '"/>')
        })
        return canvas.toDataURL()
    }
}
module.exports = verifyCode


// Draw cat with lime helmet
// loadImage('../avatar.jpg').then((image) => {
//   ctx.drawImage(image, 50, 0, 70, 70)

//   console.log('<img src="' + canvas.toDataURL() + '"/>')
// })