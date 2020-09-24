const dotenv = require('dotenv').config();

const Telegraf = require('telegraf');
const axios = require('axios');

const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Composer = require('telegraf/composer');

const bot = new Telegraf(process.env.BOT_TOKEN);

let globalLocation;

bot.start((ctx) => {
  ctx.reply('Bot started!\nType /help to see what I can!');
});

bot.help((ctx) => {
  ctx.reply(`Here is a list of commands
    /location
    /check `);
});

bot.command('check', (ctx) => {
  if (!globalLocation || typeof globalLocation == undefined) {
    ctx.reply('Вы не указали город');
  } else {
    ctx.reply(`Ваш город - ${globalLocation}`);
  }
});

const stepHandler = new Composer();

const location = new WizardScene(
  'location',
  (ctx) => {
    ctx.reply('Enter your current location');
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text.length < 2) {
      ctx.reply('Enter correct location');
      return;
    }
    globalLocation = ctx.message.text;

    ctx.reply(
      `Is ${await confirmLocation(globalLocation, ctx)} your location?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Yes!', 'correct_location'),
        Markup.callbackButton('No! Try again!', 'false_location'),
      ]).extra()
    );
    return ctx.wizard.next();
  },
  stepHandler
);

stepHandler.action('correct_location', (ctx) => {
  ctx.deleteMessage();
  ctx.reply('OK! Your current location is ' + globalLocation + ' now.');
  return ctx.scene.leave();
});

stepHandler.action('false_location', (ctx) => {
  ctx.deleteMessage();
  ctx.reply('Lets try once again');
  return ctx.scene.enter('location');
});

//confirmation of current user location
const confirmLocation = async (location, ctx) => {
  let url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.location_key}&q=${location}&format=json`;
  let res = await axios.get(url);
  let address = await res.data[0].display_name;
  //console.log(address);
  return address;
};

const stage = new Stage();
stage.register(location);

bot.use(session());
bot.use(stage.middleware());
bot.command('location', (ctx) => ctx.scene.enter('location'));
bot.launch();
