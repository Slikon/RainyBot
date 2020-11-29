const { getWeather } = require('../utils/getWeather');
const { printWeather } = require('../utils/printWeather');

//command checks current user' location and its weather
const checkCommand = async (ctx) => {
  if (!ctx.dbuser.location || typeof ctx.dbuser.location == undefined) {
    ctx.reply(
      'Вы не указали локацию. Нажмите /location чтобы начать использование!'
    );
  } else {
    ctx.reply(`Ваша локация - ${ctx.dbuser.location} 🏡`);

    const fullWeather = await getWeather(ctx.dbuser);
    // const description = fullWeather.weather[0].description;
    ctx.replyWithMarkdown(printWeather(fullWeather));
  }
};

module.exports = { checkCommand };
