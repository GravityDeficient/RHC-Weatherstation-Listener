const request = require('request');
const moment = require('moment');
let pwsweather = {
    url: 'http://www.pwsweather.com/pwsupdate/pwsupdate.php',
    query: {
        ID: 0,
        PASSWORD: 0,
        winddir: 0,
        windspeedmph: 0,
    },
    login: function(id, password) {
        this.query.ID = id;
        this.query.PASSWORD = password;
    },
    update: function(pdata) {
        this.query.dateutc = moment().utc().format("YYYY-MM-DD HH:mm:ss");
        this.query.winddir = pdata.dir;
        this.query.windspeedmph = pdata.wind;
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
            console.log("PWSWeather Get response: " + response.statusCode);
        });
    }
};
module.exports = pwsweather;