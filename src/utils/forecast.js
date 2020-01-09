const request = require('request')
const forecast = (longitude, latitude, callback) => {
    const url = 'https://api.darksky.net/forecast/c29f5b4ca6ccf94961a94d3ccaa24001/' + latitude + ',' + longitude

    request({
        url,
        json: true
    }, (error, {
        body
    }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location. Please try again!', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature +
                '°F. There is a ' + body.currently.precipIntensity + '% chance of rain.' +
                'Highest temperature is ' + body.daily.data[0].temperatureHigh + '°F. Lowest temperature is ' + body.daily.data[0].temperatureLow + '°F.')

        }
    })
}

module.exports = forecast