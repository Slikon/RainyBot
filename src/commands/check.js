const { getWeather } = require('../utils/getWeather');

//command checks current user' location and its weather
const checkCommand = async (ctx) => {
  if (!ctx.dbuser.location || typeof ctx.dbuser.location == undefined) {
    ctx.reply('Вы не указали город');
  } else {
    ctx.reply(`Ваш город - ${ctx.dbuser.location}`);

    let weather = await getWeather(ctx.dbuser);
    ctx.reply(`Weather: ${weather}`);
  }
};

module.exports = { checkCommand };
