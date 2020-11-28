const Composer = require('telegraf/composer');
const { getWeather } = require('./getWeather');

const stepHandler = new Composer();

stepHandler.action('correct_location', async (ctx) => {
  try {
    await ctx.deleteMessage();

    // saving all changes made to user's data in DB
    ctx.dbuser.location = ctx.dbuser.confirm.location;
    ctx.dbuser.latitudeLocation = ctx.dbuser.confirm.latitudeLocation;
    ctx.dbuser.longtitudeLocation = ctx.dbuser.confirm.longtitudeLocation;

    ctx.dbuser.confirm = {};

    await ctx.dbuser.save();

    await ctx.reply(
      `OK! Your current location is ${ctx.dbuser.location} now ✅`
    );
    let weather = await getWeather(ctx.dbuser);
    if (weather) {
      ctx.reply(`Weather: ${weather}`);
    }
    return ctx.scene.leave();
  } catch (e) {
    console.log(e);
    ctx.reply(
      `Не могу узнать погоду в ${ctx.dbuser.location}, прошу прощения 😞`
    );
  }
});

stepHandler.action('false_location', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.reply('Попробуем еще раз!');
  return ctx.scene.reenter();
});

stepHandler.use((ctx) =>
  ctx.replyWithMarkdown('Сделайте ваш выбор, пожалуйста!')
);

module.exports = { stepHandler };
