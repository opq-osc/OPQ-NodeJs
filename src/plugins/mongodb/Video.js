const mongoose = require('./db')

const VideoSchema = mongoose.Schema({
    mid: {
        type: Number
    },
    title: {
        type: String
    },
    desc: {
        type: String
    },
    pic: {
        type: String
    },
    bvid: {
        type: String
    },
    author: {
        type: String
    }
})


const VideoModel = mongoose.model("Video", VideoSchema, "video")

module.exports = VideoModel