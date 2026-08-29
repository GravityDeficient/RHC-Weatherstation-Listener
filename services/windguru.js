const crypto = require('crypto');
const MPH_TO_KNOTS = 0.868976;
let windguru = {
    url: 'https://www.windguru.cz/upload/api.php',
    uid: 0,
    password: 0,
    query: {
        uid: 0,
        salt: 0,
        hash: 0,
        wind_direction: 0,
        wind_avg: 0,
        wind_max: 0,
        interval: 300
    },
    login: function(uid, password) {
        this.uid = uid;
        this.password = password;
        this.query.uid = uid;
    },
    update: function(pdata) {
        const now = Date.now();
        const salt = now.toString();
        this.query.salt = salt;
        this.query.hash = crypto.createHash('md5').update(salt + this.uid + this.password).digest('hex');
        this.query.wind_direction = pdata.dir;
        this.query.wind_avg = pdata.wind * MPH_TO_KNOTS;
        this.query.wind_max = pdata.gust * MPH_TO_KNOTS;
        const measured = Date.parse(pdata.timestamp);
        this.query.unixtime = isNaN(measured) ? Math.floor(now / 1000) : Math.floor(measured / 1000);
        if(pdata.temp !== undefined) {
            this.query.temperature = (pdata.temp - 32) * 5 / 9;
        } else {
            delete this.query.temperature;
        }
        if(pdata.hum !== undefined) {
            this.query.rh = pdata.hum;
        } else {
            delete this.query.rh;
        }
        if(pdata.pres !== undefined) {
            this.query.mslp = pdata.pres / 10;
        } else {
            delete this.query.mslp;
        }
    },
    send: function() {
        const target = new URL(this.url);
        for (const [key, value] of Object.entries(this.query)) {
            if (value !== undefined && value !== null) {
                target.searchParams.set(key, value);
            }
        }
        fetch(target)
            .then(function(response) {
                return response.text().then(function(body) {
                    if (response.ok && body.trim() === 'OK') {
                        console.log('WindGuru Get response: ' + response.status);
                    } else {
                        console.error('WindGuru upload failed: HTTP ' + response.status + ' ' + body);
                    }
                });
            })
            .catch(function(err) {
                console.error(err);
            });
    }
};
module.exports = windguru;
