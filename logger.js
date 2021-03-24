const moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();
var date = moment().format('YYYY-MM-DD');
var time = moment().format('H:mm');

var fs = require('fs');

var log = {
    init: function () {
        if(!fs.existsSync(__dirname + '/logs/' + date + '-events.log')){
            fs.writeFile(__dirname + '/logs/' + date + '-events.log', '', function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    },
    event: function (data, err) {
        var stream = fs.createWriteStream(__dirname + '/logs/' + date + '-events.log', {flags: 'a'});
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