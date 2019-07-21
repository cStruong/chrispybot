//requires discord.js
const Discord = require("discord.js");
//initializes a new client object (from discord.js)
const chrispyBotClient = new Discord.Client();
const fetch = require('node-fetch');


//listening for a "ready" event before running its block.
chrispyBotClient.on("ready", () => {
  console.log("The Bot is online.");
});

//listening for a "message" event before running its block
chrispyBotClient.on("message", (message) => {

  //WEATHER FUNCTION
  if (message.content.includes("_weather") && message.author.bot === false) {

    let zipCode = message.content.split(" ")[1];
    
    if (zipCode === undefined || zipCode.length != 5 ||  parseInt(zipCode) === NaN) {
      message.channel.send("`Invalid Zip Code. Please follow the format: _weather <#####>`")
      .catch(console.error)
      return;
    } else {
    fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=OpenWeatherAPIKeyHeERE`)
      .then(response => {
        return response.json()
      })
      .then(parsedWeather => {

        const weatherPics = {
          "Clouds": "⛅️",
          "Rain": "☔️",
          "Haze": "🌫",
          "Thunderstorm": "⛈",
          "Sunny": "☀️",
          "Mist": "🌫",
          "Clear": "☀️"
        }

        const currentWeather = parsedWeather.weather[0].main

        message.channel.send({embed: {
            color: 3447003,
            fields: [{
                name: `🎯Location: ${parsedWeather.name}, ${parsedWeather.sys.country}`,
                value: `
                  ${weatherPics[currentWeather]}Forecast: ${currentWeather}, ${parsedWeather.weather[0].description}
                  🌡 Current: ${(Math.round(((parsedWeather.main.temp - 273.15) * 9/5 + 32 )))}° F
                  🔺 High: ${(Math.round(((parsedWeather.main.temp_max - 273.15) * 9/5 + 32 )))}° F
                  🔻 Low: ${(Math.round(((parsedWeather.main.temp_min - 273.15) * 9/5 + 32 )))}° F
                `
              }
            ],
            timestamp: new Date()
          }
        })
      })
    }
  }


  //next func
})


chrispyBotClient.login("Discord bot token here");
