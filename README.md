# RHC - Weather Station Listener
An weatherstation event listener for particle cloud weatherstations running [RHC-weatherstation](https://github.com/GravityDeficient/RHC-weatherstation) code.

When an event is received it is parsed and sent to WUnderground, Windy, PWSWeather, Weathercloud, OpenWeatherMap, and/or CWOP/APRS*.

**cwop/aprs code is incomplete*

## Example startup:
>node app.js --wunderground ID:KEY

## Parameters:
#### Required Parameters:
* --deviceid     :   The device ID, name or mine for only my devices.

#### Optional Parameters:
* -u --user :   A username:password combination. If no username and password combination or access token is provided the default test:test user will be used.
* -t --token : A predefined access token (recommended)
* -e --event : The event name we query against. Defaults to 'obs' 
* -o --offset : The directional offset to be applied to the reported wind direction.

#### Service Parameters:
* --wunderground : [Wunderground](https://www.wunderground.com/member/devices) settings. id:key
* --windy : [Windy](https://stations.windy.com/stations) settings. id:key
* --pwsweather : [PWSWeather](https://www.pwsweather.com/stationlist.php) settings. id:key
* --weathercloud : [Weathercloud](https://app.weathercloud.net/devices) settings. id:key
* --openweathermap : [OpenWeatherMap](https://home.openweathermap.org/api_keys) settings. id:key
* --cwop : [CWOP](http://www.wxqa.com/) settings. id:key

## Additional Notes:
Event data should have a 9 character or 22 characters length

###### Sample data 9 string: (Wind only)
wind speed, gust speed, wind direction, and battery voltage, restart

    1218213760

* Two digits are wind speed: 12 mph
* Two digits are gust speed: 18 mph
* Three digits give wind direction: 213 degrees.
* Two digits give battery voltage: 7.6V (but we add 5V - so this really means 12.6V)
* One digit to identify the first reported event

###### Sample data 18 string: (BMP280 - Temperature, and Pressure)
wind speed, wind gust, wind dir, temperature, pressure, voltage, restart
    
    121821354276000760
    
* Two digits are wind speed: 12 mph
* Two digits are gust speed: 18 mph
* Three digits give wind direction: 213 degrees.
* Three digits give temperature: 54.2
* Five digits give preasure: 760.00
* Two digits give battery voltage: 7.6V (but we add 5V - so this really means 12.6V)
* One digit to identify the first event

###### Sample data 21 string: (BME280 - Temperature, Pressure, and Humidity)
wind speed, wind gust, wind dir, temperature, pressure, humidity, voltage, restart
    
    121821354276000056760
    
* Two digits are wind speed: 12 mph
* Two digits are gust speed: 18 mph
* Three digits give wind direction: 213 degrees.
* Three digits give temperature: 54.2
* Five digits give preasure: 760.00
* Three digit give humidity: 056
* Two digits give battery voltage: 7.6V (but we add 5V - so this really means 12.6V)
* One digit to identify the first event

### TODO:
*[ ] BUGFIX Listener seams like it randomly stops receiving events but does not stop running.
*[ ] Fix errors when events have bad data. There is no error handling now.
*[ ] Add WeatherFlow Reporting Support.
