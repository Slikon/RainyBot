const Telegraf = require('telegraf');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');

const bot = new Telegraf(process.env.bot_token);

bot.start((ctx) => {
  ctx.reply('Bot started!\nType /help to see what I can!');
});

bot.help((ctx) => {
  ctx.reply(`Here is the list of commands you can use: 
/help
/location
/time
/getWeather`);
});

let globalLocation;

const location = new WizardScene(
  'location',
  (ctx) => {
    ctx.reply('Enter your current location');
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text.length < 2) {
      ctx.reply('Enter correct location');
      return;
    }
    globalLocation = ctx.message.text;

    //console.log(globalLocation)
    ctx.reply(`Your current location is ${globalLocation}`);
    return ctx.scene.leave();
  }
);

const stage = new Stage();

stage.register(location);

bot.use(session());
bot.use(stage.middleware());
bot.command('location', (ctx) => ctx.scene.enter('location'));

bot.launch();
