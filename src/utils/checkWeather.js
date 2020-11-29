const User = require('../models/user');
const { getWeather } = require('./getWeather');
const Telegraf = require('telegraf');
const { printWeather } = require('./printWeather');
const dotenv = require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

//special function for making a sleep after certain number of message sends
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function checks if weather today is rainy/snowy and reports directly to user if true
const checkWeather = async () => {
  const triggers = ['rain', 'snow', 'shower', 'drizzl'];

  const user = await User.findOne({ id: '5fc2a3552c6581001727b621' });
  // for (const user of users) {
  try {
    const fullWeather = await getWeather(user);
    const description = fullWeather.weather[0].description;

    if (triggers.some((el) => description.includes(el))) {
      bot.telegram.sendMessage(
        user.id,
        `Внимание, осадки!☔️\n${printWeather(fullWeather)}`
      );
      await sleep(100);
    }
  } catch (err) {
    if (err.response && err.response.error_code === 403) {
      await User.findByIdAndDelete(user._id);
    }
    console.log(err.message);
  }
  // }
};

module.exports = { checkWeather };
