const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const { confirmLocation } = require('../utils/confirmLocation');
const { stepHandler } = require('../utils/stepHandler');

//in 'location' scene user enters its location and saves it to DB for future purposes
const location = new WizardScene(
  'location',
  async (ctx) => {
    await ctx.reply('Введите название вашего населенного пункта:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text.length < 2 || !ctx.message.text) {
      ctx.replyWithMarkdown(`Введите *корректную* локацию:`);
      return;
    }

    //adding not confirmed yet location to 'cofirm' field
    //to check and save (if confirmed) later to user's info in database
    ctx.dbuser.confirm.location = ctx.message.text;
    ctx.dbuser.save();

    let displayLocation = await confirmLocation(
      ctx.dbuser.confirm.location,
      ctx
    );

    if (displayLocation) {
      ctx.reply(
        `Ваша локация - ${displayLocation}?`,
        Markup.inlineKeyboard([
          Markup.callbackButton('Да!', 'correct_location'),
          Markup.callbackButton('Нет! Попробуем еще!', 'false_location'),
        ]).extra()
      );
    }
    if (!displayLocation) {
      ctx.scene.reenter();
    }
    return ctx.wizard.next();
  },
  stepHandler
);

module.exports = { location };
