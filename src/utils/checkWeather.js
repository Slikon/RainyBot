const User = require('../models/user');
const { getWeather } = require('./getWeather');
const Telegraf = require('telegraf');
const dotenv = require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

// function checks if weather today is rainy/snowy and reports directly to user if true
const checkWeather = async () => {
  let triggers = ['rain', 'snow', 'shower'];

  const users = await User.find({});
  users.forEach(async (user) => {
    let weather = await getWeather(user);
    if (triggers.some((el) => weather.includes(el))) {
      bot.telegram.sendMessage(
        user.id,
        `Сегодня осадки!
Погода в ${user.location}: ${weather}`
      );
    }
  });
};

module.exports = { checkWeather };
