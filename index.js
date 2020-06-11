const Telegraf = require("telegraf");
const axios = require("axios");

process.env.bot_token = "1077764763:AAHTDfUhv_Mk5JJ1gwgAoYqyR0uWugoYPbw"

const bot = new Telegraf(process.env.bot_token)

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