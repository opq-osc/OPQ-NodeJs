const BiliUp = require('./Up')
const Video = require('./Video')
const Job = require('./Job')

let CRUD = {
    async listByGroupId(groupId) {
        return BiliUp.find({ groupId: groupId }, (err, res) => {
            if (err) {
                console.log(err)
                return err
            }
            if (res.length != 0) {
                return res
            }
        })
    },
    async listAll() {
        return BiliUp.find({}, (err, res) => {
            if (err) {
                console.log(err)
                return err
            }
            if (res.length != 0) {
                return res
            }
        })
    },
    async listMid() {
        return BiliUp.distinct('mid', (err, res) => {
            if (err) {
                console.log(err)
                return err
            }
            if (res.length != 0) {
                // [ 25876945, 473837611, ... ]
                return res
            }
        })
        // return BiliUp.aggregate({ $group: { _id: '$mid' } }, (err, res) => {
        //     if (err) {
        //         console.log(err)
        //         return err
        //     }
        //     if (res.length != 0) {
        //         // [ 25876945, 473837611, ... ]
        //         return res
        //     }
        // })
    },
    async selectOne(mid) {
        return BiliUp.findOne({ mid: mid }, (err, res) => {
            if (err) {
                console.log(err)
                return err
            }
            if (res.length != 0) {
                return res
            }
        })
    },
    async save(data) {
        return new Promise((reslove, reject) => {
            BiliUp.find({ mid: data.mid, groupId: data.groupId }, (err, res) => {
                if (err) {
                    console.log(err)
                    reject(false)
                } if (res.length != 0) {
                    reslove('已经订阅该up主！')
                }
                else {
                    BiliUp.create(data, (err, res) => {
                        if (err) {
                            console.log(err)
                            reject(false)
                        } else if (res) {
                            reslove('订阅成功！');
                        }

                    })
                }
            })
        })
    },
    async delete(data) {
        return new Promise((reslove, reject) => {
            BiliUp.deleteOne({ mid: data.mid, groupId: data.groupId }, (err, res) => {
                if (err) {
                    console.log(err)
                    reject(false)
                }
                if (res.deletedCount === res.n) {
                    reslove(true)
                }
            })
        })
    },

    async findByBvid(bvid) {
        return Video.findOne({ bvid: bvid }, (err, res) => {
            if (err) {
                console.log(err)
                return err
            }
            if (res) {
                // console.log('---res-crud---') 
                // console.log(res)
                return res
            }
        })
    },
    insert(data) {
        Video.create(data, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                console.log('success')
            }

        })
    },


    async findJob(md5,groupId) {
        return Job.findOne({ md5: md5, groupId: groupId }, (err, res) => {
            if (err) {
                console.log(err)
                return err
            }
            if (res) {
                return res
            }
        })
    },
    saveJob(data) {
        Job.create(data, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                console.log('success')
            }

        })
    }



}


module.exports = CRUD
