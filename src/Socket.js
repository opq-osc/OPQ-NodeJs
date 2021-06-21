const io = require('socket.io-client')
const fs = require('fs')
let Users = []
// 读取配置文件
const config = JSON.parse(fs.readFileSync('./config/opqConfig.json'))
const WS_API = "http://" + config.HOST + ":" + config.PORT
const QQ = config.QQ
const socket = io(WS_API, {
    transports: ['websocket']
})

socket.on('connect', e => {
    console.log('OPQ启动成功')
    socket.emit('GetWebConn', '' + QQ, (data) => console.log(data))
})

socket.on('disconnect', e => console.log('WS已断开', e))

function getConnect() {
    socket.emit('GetWebConn', '' + QQ, (data) => console.log('心跳成功!'))
}
// 保持连接 每隔30s
setInterval(() => {
    getConnect()
}, 30000)

function getSocket() {
    return socket;
}

module.exports = {
    getSocket
}