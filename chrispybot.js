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
    fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=OpenWeather API Key goes here`)
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

        if (parsedWeather.cod === '404') {
          message.channel.send("`This zip code does not exist or there is no information available.`")
        } else {
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
        }
      })
    }
  }


  //yelp function
  if (message.content.includes("_yelp") && message.author.bot === false) {
    let query = message.content.slice(6);
    let location = query.split(" ").slice(-1);
    let queryStr = query.split(" ").pop(-1).join(" ");
    fetch(`https://api.yelp.com/v3/businesses/search?&location=${location}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer Yelp Key Goes Here"
      }
    })
    .then(response => {
      return response.json();
    })
    .then(parsedJSON => {
      console.log(parsedJSON);
      //perhaps for each inside embed is a field for each business
      message.channel.send({embed:{
        color: 3447003,

        fields:[{
          name: `Results for ${queryStr} at ${location}` ,
          value:
          parsedJSON.businesses.forEach(business => {
            "Business: " + business.name;
        })}]
      }
      })
    })
  }

  if (message.content.includes("_youtube") && message.author.bot === false) {
    message.channel.send("Youtube Functionalities are in the works!")
  }

})


chrispyBotClient.login("Discord Token goes here");
