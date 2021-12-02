const request = require('request');

let wunderground = {
    url: 'http://weatherstation.wunderground.com/weatherstation/updateweatherstation.php',
    query: {
        ID: 0,
        PASSWORD: 0,
        dateutc: 'now',
        winddir: 0,
        windspeedmph: 0,
        windgustmph: 0,
        softwaretype: 'vwsversionxx',
        action: 'updateraw'
    },
    login: function(id, password) {
        this.query.ID = id;
        this.query.PASSWORD = password;
    },
    update: function(pdata) {
        this.query.winddir = pdata.dir;
        this.query.windspeedmph = pdata.wind;
        this.query.windgustmph = pdata.gust;
        if(pdata.temp !== undefined) {
            this.query.tempf = pdata.temp;
        }
        if(pdata.pres !== undefined) {
            this.query.baromin = (pdata.pres / 10) * 0.02952999;
        }
        if(pdata.hum !== undefined) {
            this.query.humidity = pdata.hum;
        }
        if(pdata.dewp !== undefined) {
            this.query.dewptf = pdata.dewp;
        }
    },
    send: function() {
        request({url:this.url, qs:this.query}, function(err, response, body) {
            if(err) { console.error(err); return; }
            console.log("WUnderground Get response: " + response.statusCode);
        });
    }
};
module.exports = wunderground;