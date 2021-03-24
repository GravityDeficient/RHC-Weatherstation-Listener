#!/usr/bin/env node
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

console.log('App Start..');
var args = require('yargs')
    .option('user', {
        alias: 'u',
        describe: 'A username:password combination \n If no username and password combination or access token is provided the default test:test user will be used.'
    })
    .option('token', {
        alias: 't',
        describe: 'A predefined access token (recommended)'
    })
    .option('event', {
        alias: 'e',
        describe: 'The event name we query against'
    })
    .option('deviceID', {
        alias: 'd',
        describe: 'The device ID, name or mine for only my devices.'
    })
    .option('offset', {
        alias: 'o',
        describe: 'The directional offset to be applied to the reported wind direction.'
    })
    .option('wunderground', {
        describe: 'Wunderground settings. pwsID:key'
    })
    .option('windy', {
        describe: 'Windy settings. station ID:APIKey'
    })
    .option('pwsweather', {
        describe: 'PWSWeather settings. stationID:APIKey'
    })
    .option('weathercloud', {
        describe: 'Weathercloud settings. ID:Key'
    })
    .option('openweathermap', {
        describe: 'OpenWeatherMap settings. external_id:appkey'
    })
    // .option('cwop', {
    //     describe: 'CWOP settings.'
    // })

    .demandOption(['deviceID'], 'Please provide device ID at minimum.')
    .help()
    .argv

if(args.u === undefined){
    args.u = 'test:test';
}
var userPass = args.u.match(/([^:]*):(.*)/);
const credentials = {
    username:   userPass[1],
    password:   userPass[2],
    token:      args.t
};

if(args.e === undefined) {
    var event_name = 'obs';
} else {
    var event_name = args.e;
}

if(args.d === undefined) {
    var device = null;
} else {
    var device = args.d;
}

if(args.o === undefined) {
    var dir_offset = 0;
} else {
    var dir_offset = args.o;
}

console.info('Device ID:', device, 'Event Name:', event_name);

let storage = {};

if(args.wunderground !== undefined) {
    const wunderground_credentials = {
        pws_id:   args.wunderground.match(/([^:]*):(.*)/)[1],
        password:   args.wunderground.match(/([^:]*):(.*)/)[2],
    };
    storage.wunderground = require(__dirname + '/services/wunderground.js');
    storage.wunderground.login(wunderground_credentials.pws_id, wunderground_credentials.password);
    console.info('Reporting to WUnderground: ', wunderground_credentials.pws_id);
}

if(args.windy !== undefined) {
    const windy_credentials = {
        station_id:   args.windy.match(/([^:]*):(.*)/)[1],
        apikey:   args.windy.match(/([^:]*):(.*)/)[2],
    };
    storage.windy = require(__dirname + '/services/windy.js');
    storage.windy.login(windy_credentials.station_id, windy_credentials.apikey);
    console.info('Reporting to Windy: ', windy_credentials.station_id);
}

if(args.pwsweather !== undefined) {
    const pwsweather_credentials = {
        station_id:   args.pwsweather.match(/([^:]*):(.*)/)[1],
        apikey:   args.pwsweather.match(/([^:]*):(.*)/)[2],
    };
    storage.pwsweather = require(__dirname + '/services/pwsweather.js');
    storage.pwsweather.login(pwsweather_credentials.station_id, pwsweather_credentials.apikey);
    console.info('Reporting to PWSWeather: ', pwsweather_credentials.station_id);
}

if(args.weathercloud !== undefined) {
    const weathercloud_credentials = {
        id:   args.weathercloud.match(/([^:]*):(.*)/)[1],
        apikey:   args.weathercloud.match(/([^:]*):(.*)/)[2],
    };
    storage.weathercloud = require(__dirname + '/services/weathercloud.js');
    storage.weathercloud.login(weathercloud_credentials.id, weathercloud_credentials.apikey);
    console.info('Reporting to WeatherCloud: ', weathercloud_credentials.id);
}

if(args.openweathermap !== undefined) {
    const openweathermap_credentials = {
        external_id:   args.openweathermap.match(/([^:]*):(.*)/)[1],
        apikey:   args.openweathermap.match(/([^:]*):(.*)/)[2],
    };
    storage.openweathermap = require(__dirname + '/services/openweathermap.js');
    storage.openweathermap.login(openweathermap_credentials.external_id, openweathermap_credentials.apikey);
    console.info('Reporting to OpenWeatherMap: ' + openweathermap_credentials.external_id);
}

// if(args.cwop !== undefined) {
//     var cwop = args.cwop.match(/([^:]*):(.*)/);
//     const openweathermap_credentials = {
//         id:   cwop_idpass[1],
//         apikey:   openweathermap_idpass[2],
//     };
//     storage.openweathermap = require(__dirname + '/services/openweathermap.js');
//     storage.openweathermap.login(openweathermap_credentials.external_id, weathercloud_credentials.apikey);
//     console.log('Reporting to OpenWeatherMap: ' + openweathermap_credentials.external_id);
// }

var listener = require(__dirname + '/listener.js').listener;
listener(credentials, event_name, device, dir_offset, storage);
