const User = require('../models/user');
const { getWeather } = require('./getWeather');
const Telegraf = require('telegraf');
const { printWeather } = require('./printWeather');
const dotenv = require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const checkWeather = async () => {
  const triggers = ['rain', 'snow', 'shower', 'drizzl'];

  const users = await User.find();
  for (const user of users) {
    try {
      const fullWeather = await getWeather(user);
      const description = fullWeather.weather[0].description;

      if (triggers.some((el) => description.includes(el))) {
        bot.telegram.sendMessage(
          user.id,
          `Внимание, осадки!☔️\n${printWeather(fullWeather)}`,
          { parse_mode: 'Markdown' }
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
