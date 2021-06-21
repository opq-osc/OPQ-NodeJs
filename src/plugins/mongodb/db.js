const mongoose = require('mongoose')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./config/opqConfig.json'))
mongoose.connect(config.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('mongodb连接成功')
})


// mongoose.connect('mongodb://localhost/Test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true
// },(err)=>{
//   if(err){
//     console.log(err)
//     return
//   }
//   console.log('连接成功')
// })

module.exports = mongoose
