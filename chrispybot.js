//requires discord.js
const Discord = require("discord.js");
//initializes a new client object (from discord.js)
const chrispyBotClient = new Discord.Client();
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();

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
    fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=${process.env.OPENWEATHER_KEY}`)
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
    let location = query.split("@").slice(-1);
    let queryStr = query.split("@").slice(0, -1).join(" ");

    fetch(`https://api.yelp.com/v3/businesses/search?&term=${query}+&location=${location}+&limit=5`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.YELP_KEY}`
      }
    })
    .then(response => 
      response.json()
    )
    .then(parsedJSON => {
      console.log(parsedJSON);
      //perhaps for each inside embed is a field for each business
      //store all called somewhere, 
      //look into discord js edit message 
      //also awaitReactions and clear reactions, maybe even reaction counter
      let fieldsArray = []
      parsedJSON.businesses.map(business => {
        fieldsArray.push({name: `${fieldsArray.length + 1}.`,
         value:
         `
         Name: [${business.name}](${business.url})
         Rating: ${business.rating} / 5
         Price: ${!!business.price ? business.price : "No Price Data"}
         `
        })
      })
      message.channel.send({embed:{
        color: 3447003,
        description: `Results for ${queryStr} ${location}`,
        fields: fieldsArray
      }})
      .then(message => {
        message.react("➡")
      })
    })
  }

  //youtube function
  if (message.content.includes("timothy") && message.author.bot === false) {
    message.channel.send("Tim likes feet")
  }

  if (message.content.toLowerCase().includes("patrick") && message.author.bot === false) {
    message.channel.send("pat future NYPD sign these documents")
  }

})


chrispyBotClient.login(`${process.env.DISCORD_TOKEN}`);
