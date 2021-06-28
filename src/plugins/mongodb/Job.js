const mongoose = require('./db')

const JobSchema = mongoose.Schema({
  md5: {
    type: String
  },
  content: {
    type: String
  },
  imageUrl: {
    type: String
  },
  linkUrl: {
    type: String
  },
  groupId:{
    type: Number
  }
})


const JobModel = mongoose.model("Job", JobSchema, "job")

module.exports = JobModel