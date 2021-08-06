const Api = require('../SendMsg')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const fs = require('fs')
let Wordcloud = {
    doAction(groupId) {
        const cmdStr = 'python3 /root/py/wc.py ' + groupId;
        exec(cmdStr, function (err, stdout, stderr) {
            if (err) {
                console.log('get weather api error:' + stderr);
            } else {
                const imageData = fs.readFileSync('/root/opq/wordcloud.jpg');
                const imageBase64 = imageData.toString("base64");
                console.log(imageBase64.substring(1, 10))
                Api.SendPicMsgWithBase64(groupId, imageBase64)

            }
        });

        // free = spawn('python3', ['/root/py/wc.py']);

        // free.stdout.on('data', function (data) {
        //     console.log('standard output:\n' + data);
        // });

        // free.stderr.on('data', function (data) {
        //     console.log('standard error output:\n' + data);
        //     const imageData = fs.readFileSync('/root/py/wordcloud.jpg');
        //     const imageBase64 = imageData.toString("base64");
        //     console.log(imageBase64.substring(1, 10))
        //     Api.SendPicMsgWithBase64(groupId, imageBase64)
        // });

        // free.on('exit', function (code, signal) {
        //     console.log('child process eixt ,exit:' + code);
        // });
    }
}

module.exports = Wordcloud