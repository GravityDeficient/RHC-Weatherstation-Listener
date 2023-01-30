const net = require('net');
let cwop = {
  host: 'cwop.aprs.net',
  port: 14580,
  ID: 0,
  PASSWORD: 0,
  query: "",

  login: function(id, password) {
    this.ID = id;
    this.PASSWORD = password;
  },

  update: function(pdata) {
    const timestamp = Math.floor(Date.now() / 1000);

    this.query = `user ${this.ID} pass ${this.PASSWORD} vers NodeJS-0.1\n`;
    this.query += `weather ${this.ID} "@${timestamp}z ${pdata.winddir}/${pdata.windspeedmph}g${pdata.windgustmph}`;

    if (pdata.temp !== undefined) {
      this.query += `t${pdata.temp}`;
    }
    if (pdata.dewp !== undefined) {
      this.query += `d${pdata.dewp}`;
    }
    if (pdata.hum !== undefined) {
      this.query += `h${pdata.hum}`;
    }
    if (pdata.pres !== undefined) {
      this.query += `b${pdata.pres}`;
    }

    this.query += "\n";
  },

  send: function() {
    const client = new Net.Socket();
    client.connect({ port: this.port, host: this.host }, function() {
      client.write(this.query);
      client.end();
    });

    client.on('end', function() {
      console.log('Requested an end to the TCP connection');
    });

    console.log("CWOP/APRS sent..");
  }
};

module.exports = cwop;
