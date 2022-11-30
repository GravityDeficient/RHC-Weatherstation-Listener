var exports = module.exports = {};
var convert = require('convert-units');

const Particle = require('particle-api-js');
const particle = new Particle();

exports.listener = function (credentials, event_name, device, dir_offset, storage) {
    if(credentials.token === undefined)  {
        particle.login({username: credentials.username, password: credentials.password}).then(
            function (data) {
                getEvents(event_name, device, data.body.access_token, dir_offset, storage);
            },
            function (err) {
                console.error('Login Error: ', err);
                throw "Could not login in.";
            }
        );
    } else {
        getEvents(event_name, device, credentials.token, dir_offset, storage);
    }
}

function getEvents(event_name, device, token, dir_offset, storage) {
    particle.getEventStream({ deviceId: device, name: event_name, auth: token }).then(
        function(stream) {
            stream.on('event', function(data) {
                var pdata = exports.parseData(data,dir_offset);
                if(pdata.startup === 1) {
                    console.warn('Startup Observation!');
                }

                console.log(JSON.stringify(pdata));

                if(pdata.errorMessage == '') {
                    for (var service in storage) {
                        if (storage.hasOwnProperty(service) && storage[service].hasOwnProperty('update') && storage[service].hasOwnProperty('send')) {
                            storage[service].update(pdata);
                            storage[service].send();
                        }
                    }
                }

            });

            stream.on('end', function(data) {
                console.error('Particle event stream ended!');
                stream.abort();
                process.exit(); // Kill the server - we expect pm2 to restart the service
            });
        },
        function(err) {
            console.error('Stream Error: ',err);
            getEvents(event_name, restart, token, dir_offset, storage);
        }
    );
}

// --------------------------------------------------------------------------------------------------
// The data will have a 9, 10, 18, 21 or 22 character string.
//
// Wind Only
// 9 or 10 data string that gives wind speed, gust speed, wind direction, battery voltage, and startup
// Sample data string:  12 18 213 76 1
// Wind speed: 12 mph
// Wind gust speed: 18 mph
// Wind direction: 213 degrees.
// Battery voltage: 7.6V (but we add 5V - so this really means 12.6V)
// Restart boolean. The first event this will be flipped to 1 (NOTE: legacy 9 char length doesnt have this)
//
// BMP280 attached
// 18 data string that gives wind_speed, wind_gust, wind_dir, temperature, pressure, voltage, and startup
// Sample data string: 12 18 213 054 76000 76 1
// Wind speed: 12 mph
// Wind gust speed: 18 mph
// Wind direction: 213 degrees.
// Temperature: 54f
// Preasure: 760.00hPa
// Battery voltage: 7.6V (but we add 5V - so this really means 12.6V)
// Restart boolean. The first event this will be flipped to 1
//
// BME280 attached
// 18 data string that gives wind_speed, wind_gust, wind_dir, temperature, pressure, humidity, voltage, and startup
// Sample data string: 12 18 286 058 10004 056 69 1
// Wind speed: 12 mph
// Wind gust speed: 18 mph
// Wind direction: 286 degrees.
// Temperature: 58f
// Preasure: 100.04
// Battery voltage: 6.9V (but we add 5V - so this really means 11.9V)
// Restart boolean. The first event this will be flipped to 1
// --------------------------------------------------------------------------------------------------
exports.parseData = function (data, dir_offset) {
    let pdata = {rawData: data.data, errorMessage: ''};
    try {
        let n = parseInt(data.data.length);

        if (n != 9 && n != 10 && n != 18 && n != 21) {
            throw 'data-string-error: invalid-string-length';
        }

        let dir = parseInt(data.data.substring(4,7)) + dir_offset;
        if(dir > 360) {
            dir = dir - 360;
        }

        pdata.wind = parseInt(data.data.substring(0,2));
        pdata.gust = parseInt(data.data.substring(2,4));
        pdata.dir = dir;
        pdata.timestamp = data.published_at;

        if(n == 9) {
            pdata.pwr = ((parseInt(data.data.substring(7,9)) * .1) + 5).toFixed(2);
        }

        if(n == 10) {
            pdata.pwr = ((parseInt(data.data.substring(7,9)) * .1) + 5).toFixed(2);
            pdata.startup = parseInt(data.data.substring(9,10));
        }

        if(n == 18) {
            pdata.temp = parseInt(data.data.substring(7,10));
            pdata.pres = parseInt(data.data.substring(10,15));
            pdata.pwr = ((parseInt(data.data.substring(15,17)) * .1) + 5).toFixed(2);
            pdata.startup = parseInt(data.data.substring(17,18));
        }

        if(n == 21) {
            pdata.temp = parseInt(data.data.substring(7,10));
            pdata.pres = parseInt(data.data.substring(10,15));
            pdata.hum = parseInt(data.data.substring(15,18));
            pdata.pwr = ((parseInt(data.data.substring(18,20)) * .1) + 5).toFixed(2);
            pdata.startup = parseInt(data.data.substring(20,21));
        }

        if( (n == 18 || n == 21) && pdata.temp > 0 && pdata.hum > 0) {
            dewCalc = require(__dirname + '/dew.js');
            try {
                pdata.dewp = convert(dewCalc.dewPoint(pdata.hum,convert(pdata.temp).from('F').to('K'))).from('K').to('F').toFixed(2);
            } catch (e) {
                pdata.errorMessage = "dewpoint-below-valid-range: " + e;
            }
        }

    }
    catch (err) {
        pdata.errorMessage = err;
        console.error(err);
    }

    // Sanatize the data here!
    // If we get an event but nothing is defined properly we delete the keys or the DB will choke.
    for (var k in pdata) {
        if(isNaN(pdata[k]) && k !== 'timestamp' && k !== 'rawData' && k !== 'errorMessage') {
            if (pdata.errorMessage.length > 0) {
                pdata.errorMessage += ", ";
            }
            pdata.errorMessage += "invalid-data-type-error: " + k;
            delete pdata[k];
        }
    }

    return pdata;
}