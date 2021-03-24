const request = require('request');
const moment = require('moment');
let windy = {
    url: 'https://stations.windy.com/pws/update/',
    query: {
        stationId: 0,
        winddir: 0,
        windspeedmph: 0,
        windgustmph: 0,
    },
    login: function(id, key) {
        this.url = this.url + key;
        this.query.stationId = id;
    },
    update: function(pdata) {
        this.query.time = moment().utc().toISOString();
        this.query.winddir = pdata.dir;
        this.query.windspeedmph = pdata.wind;
        this.query.windgustmph = pdata.gust;
        if(pdata.temp !== undefined) {
            this.query.tempf = pdata.temp;
        }
        if(pdata.pres !== undefined) {
            this.query.baromin = pdata.pres/3386;
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
            console.log("Windy Get response: " + response.statusCode);
        });
    }
};
module.exports = windy;