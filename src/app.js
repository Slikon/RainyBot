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
let longLocation;
let latLocation;

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
  async (ctx) => {
    await ctx.reply('Enter your current location');
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text.length < 2) {
      ctx.reply('Enter **correct** location');
      return;
    }
    globalLocation = ctx.message.text;

    let displayLocation = await confirmLocation(globalLocation, ctx);
    console.log();
    if (displayLocation) {
      ctx.reply(
        `Is ${displayLocation} your location?`,
        Markup.inlineKeyboard([
          Markup.callbackButton('Yes!', 'correct_location'),
          Markup.callbackButton('No! Try again!', 'false_location'),
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

stepHandler.action('correct_location', async (ctx) => {
  await ctx.deleteMessage();
  ctx.reply('OK! Your current location is ' + globalLocation + ' now.');
  return ctx.scene.leave();
});

stepHandler.action('false_location', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.reply('Lets try once again');
  return ctx.scene.reenter();
});

//confirmation of current user location
const confirmLocation = async (location, ctx) => {
  //let urlU = `https://eu1.locationiq.com/v1/search.php?key=${process.env.location_key}&q=${location}&format=json`;
  let url = encodeURI(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.location_key}&q=${location}&format=json`
  );
  console.log(url);
  try {
    let res = await axios.get(url);
    let address = await res.data[0].display_name;
    //console.log(address);
    return address;
  } catch (err) {
    console.log(err.response.data);
    //await ctx.reply('deleting prev (incorrect) message');
    await ctx.reply('Your location is not found. Wanna try again?');
    return false;
  }
};

const stage = new Stage();
stage.register(location);

bot.use(session());
bot.use(stage.middleware());
bot.command('location', (ctx) => ctx.scene.enter('location'));
bot.launch();
