const request = require('request');
const net = require('net');
let cwop = {
    host: 'cwop.aprs.net',
    port: 14580,
    packet: {
        ID: 0,
        PASSWORD: 0,
        winddir: 0,
        windspeedmph: 0,
        windgustmph: 0,
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
        const client = new Net.Socket();
        client.connect({ port: this.port, host: this.host }, function() {
            client.write('Hello, server.');
        });
        client.on('end', function() {
            console.log('Requested an end to the TCP connection');
        });

        console.log("CWOP/APRS sent..");
    }
};
module.exports = cwop;