const moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();
var date = moment().format('YYYY-MM-DD');
var time = moment().format('H:mm');

var fs = require('fs');
var path = require('path');

function ensureLogFile() {
    const logsDir = path.join(__dirname, 'logs');
    const logPath = path.join(logsDir, date + '-events.log');

    try {
        fs.mkdirSync(logsDir, {recursive: true});
    } catch (err) {
        console.error('Failed to create logs directory:', err);
        throw err;
    }

    return logPath;
}

var log = {
    init: function () {
        const logPath = ensureLogFile();
        if(!fs.existsSync(logPath)){
            fs.writeFile(logPath, '', function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    },
    event: function (data, err) {
        var stream = fs.createWriteStream(ensureLogFile(), {flags: 'a'});
        var error = '';
        if(err !== undefined){
            error = err;
        }
        stream.write(time + " " + data + error + "\n");
        stream.end();
        console.log(data, error);
    }
};

module.exports = log;
