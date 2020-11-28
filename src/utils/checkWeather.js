const User = require('../models/user');
const { getWeather } = require('./getWeather');
const Telegraf = require('telegraf');
const dotenv = require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

//special function for making a sleep after certain number of message sends
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function checks if weather today is rainy/snowy and reports directly to user if true
const checkWeather = async () => {
  let triggers = ['rain', 'snow', 'shower', 'drizzl'];

  const users = await User.find({});
  for (const user of users) {
    try {
      let weather = await getWeather(user);
      if (triggers.some((el) => weather.includes(el))) {
        bot.telegram.sendMessage(
          user.id,
          `Внимание, осадки!\nПогода в ${user.location}: ${weather}☔️`
        );
        await sleep(100);
      }
    } catch (err) {
      if (err.response && err.response.error_code === 403) {
        await User.findByIdAndDelete(user._id);
      }
      console.log(err.message);
    }
  }
};

module.exports = { checkWeather };
