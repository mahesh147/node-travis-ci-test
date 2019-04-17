const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url =
        "https://api.darksky.net/forecast/4cb6117a2384b441610e3d98318d697e/" +
        latitude +
        "," +
        longitude +
        "?units=si";

    request({ url: url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to weather services", undefined);
        } else if (body.error) {
            callback("Unable to find location", undefined);
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                rainProb: body.currently.precipProbability
            });
        }
    });
};

module.exports = forecast;
