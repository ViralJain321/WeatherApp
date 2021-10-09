require('dotenv').config()
const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.route("/")

    .get(function (req, res) {
        res.render("index");
    })


    .post(function (req, res) {


        const query = req.body.cityName;
        const units = "metric";

        const url = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.API_KEY}&q=${query}&units=${units}`;


        https.get(url, function (response) {
            console.log(response.statusCode);


            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                console.log(weatherData);

                const CityName = weatherData.name;

                const time = weatherData.dt;
                const timezone = weatherData.timezone;
                const d = new Date((time + timezone) * 1000);
               
              
                const currentDate = d.toLocaleDateString("en-IN" ,{
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                })
              
                

                const temperature = Math.round(weatherData.main.temp);
                const weatherDescription = weatherData.weather[0].main;
                const icon = weatherData.weather[0].icon;


                const visibility = weatherData.visibility / 1000;

                const humidity = weatherData.main.humidity;
               
                const pressure = weatherData.main.pressure;
                               
                const windSpeed = (weatherData.wind.speed );
               
                const windDegree = weatherData.wind.deg;
                function degToCompass(windDegree) {
                   var val = Math.floor((windDegree / 22.5) + 0.5);
                   var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
                   return arr[(val % 16)];
               };
               const windDirection = degToCompass(windDegree);
              
                const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
              

                res.render("weather", {
                    CityName: CityName,
                    currentDate: currentDate,
                    temperature: temperature,
                    weatherDescription: weatherDescription,
                    imageURL: imageURL,
                    humidity : humidity,
                    visibility :visibility,
                    pressure : pressure,
                    windSpeed: windSpeed,
                    windDirection : windDirection
                
                });
            })
        })

    });



app.listen("3000", function () {
    console.log("Server is runnning on 3000");
});


