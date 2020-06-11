const Telegraf = require("telegraf");
const axios = require("axios");

const bot = new Telegraf("");

bot.start((ctx) => {
  ctx.reply("Bot started!\nType /help to see what I can!");
});

let currentLocation;

bot.help((ctx) => {
  ctx.reply(`Here is the list of commands you can use: 
/help
/location
/time
/getWeather`)
})

bot.command('location', (ctx) => {
  ctx.reply('Type your location below!')
})


bot.launch()