const mongoose = require('./db')

const BiliUpSchema = mongoose.Schema({
  groupId:{
    type: Number
  },
  mid: {
    type: Number
  },
  uname: {
    type: String
  },
  usign: {
    type: String
  },
  upic: {
    type: String,
    set(params) {
      // 自定义预处理
      return 'https:' + params
    },
  }
})


const BiliUpModel = mongoose.model("BiliUp", BiliUpSchema, "biliup")

module.exports = BiliUpModel