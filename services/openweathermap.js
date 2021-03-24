const request = require('request');
let openweathermap = {
    uri: 'https://api.openweathermap.org/data/3.0/stations',
    query: {
        appid: 0,
    },
    json: {
        station_id: 0,
        dt: 0,
        wind_speed: 0,
        wind_gust: 0,
        wind_deg: 0
    },
    login: function(external_id, appkey) {
        this.json.station_id = external_id;
        this.query.appid = appkey;
    },
    update: function(pdata) {
        this.json.winddir = pdata.dir;
        this.json.windspeedmph = pdata.wind;
        this.json.windgustmph = pdata.gust;
        if(pdata.temp !== undefined) {
            this.json.tempf = pdata.temp;
        }
        if(pdata.pres !== undefined) {
            this.json.baromin = pdata.pres/3386;
        }
        if(pdata.hum !== undefined) {
            this.json.humidity = pdata.hum;
        }
        if(pdata.dewp !== undefined) {
            this.json.dewptf = pdata.dewp;
        }
    },
    send: function() {
        request({uri:this.uri, query:this.query, method:'POST', json:this.json}, function(err, response, body) {
            if(err) { console.error(err); return; }
            console.log("OpenWeatherMap Get response: " + response.statusCode);
            console.log(response.body);
        });
    }
};
module.exports = openweathermap;