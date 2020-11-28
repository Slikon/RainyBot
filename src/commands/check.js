const { getWeather } = require('../utils/getWeather');

//command checks current user' location and its weather
const checkCommand = async (ctx) => {
  if (!ctx.dbuser.location || typeof ctx.dbuser.location == undefined) {
    ctx.reply(
      'Вы не указали локацию. Нажмите /location чтобы начать использование!'
    );
  } else {
    ctx.reply(`Ваша локация - ${ctx.dbuser.location} 🏡`);

    let weather = await getWeather(ctx.dbuser);
    ctx.reply(`Погода сегодня: ${weather}.`);
  }
};

module.exports = { checkCommand };
