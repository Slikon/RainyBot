const { getWeather } = require('../utils/getWeather');

//command checks current user' location and its weather
const checkCommand = async (ctx) => {
  if (!ctx.dbuser.location || typeof ctx.dbuser.location == undefined) {
    ctx.reply(
      'You did not mention your location. Type /location to get started!'
    );
  } else {
    ctx.reply(`Your location - ${ctx.dbuser.location}.`);

    let weather = await getWeather(ctx.dbuser);
    ctx.reply(`Weather: ${weather}.`);
  }
};

module.exports = { checkCommand };
