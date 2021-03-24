const request = require('request');
const convert = require('convert-units');
let weathercloud = {
    url: 'http://api.weathercloud.net/v01/set',
    query: {
        wid: 0,
        key: 0,
        winddir: 0,
        wspd: 0,
    },
    login: function(id, key) {
        this.query.wid = id;
        this.query.key = key;
    },
    update: function(pdata) {
        this.query.winddir = pdata.dir;
        this.query.wspd = convert(pdata.wind).from('m/h').to('m/s');
        if(pdata.temp !== undefined) {
            this.query.temp = convert(pdata.temp).from('F').to('C');
        }
        if(pdata.pres !== undefined) {
            this.query.baromin = pdata.pres;
        }
        if(pdata.hum !== undefined) {
            this.query.humidity = pdata.hum;
        }
    },
    send: function() {
        request({url:this.url, qs:this.query}, function(err, response, body) {
            if(err) { console.error(err); return; }
            console.log("WeatherCloud Get response: " + response.statusCode);
        });
    }
};
module.exports = weathercloud;