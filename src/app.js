const dotenv = require('dotenv').config();

const Telegraf = require('telegraf');
const axios = require('axios');
const mongoose = require('mongoose');

const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Composer = require('telegraf/composer');
const bot = new Telegraf(process.env.BOT_TOKEN);
const databaseUrl = process.env.MONGO_URL;
const User = require('./models/user');
const { db } = require('./models/user');
const user = require('./models/user');

const connect = mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connection to MongoDB
connect
  .then((db) => {
    console.log('Connected succesfully to the server!');
  })
  .catch((err) => {
    console.log(err);
  });

bot.use(async (ctx, next) => {
  // ищем юзера
  let user = await User.findOne({ id: ctx.from.id });

  // если нет - создаем
  if (!user) {
    user = await User.create({
      id: ctx.from.id,
    });
  }

  //console.log(user);
  ctx.dbuser = user;
  next();
});

bot.start((ctx) => {
  ctx.reply('Bot started!\nType /help to see what I can!');
});

bot.help((ctx) => {
  ctx.reply(`Here is a list of commands
    /location
    /check `);
});

bot.command('check', async (ctx) => {
  if (!ctx.dbuser.location || typeof ctx.dbuser.location == undefined) {
    ctx.reply('Вы не указали город');
  } else {
    ctx.reply(`Ваш город - ${ctx.dbuser.location}`);

    getWeather(ctx);
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

    //adding not confirmed (yet) location to 'cofirm' field
    //to check and save (if confirmed) later to user's info in database
    ctx.dbuser.confirm.location = ctx.message.text;
    ctx.dbuser.save();

    let displayLocation = await confirmLocation(
      ctx.dbuser.confirm.location,
      ctx
    );

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
  try {
    await ctx.deleteMessage();

    // saving all changes made to user's data in DB
    ctx.dbuser.location = ctx.dbuser.confirm.location;
    ctx.dbuser.latitudeLocation = ctx.dbuser.confirm.latitudeLocation;
    ctx.dbuser.longtitudeLocation = ctx.dbuser.confirm.longtitudeLocation;

    ctx.dbuser.confirm = {};

    await ctx.dbuser.save();

    await ctx.reply(
      'OK! Your current location is ' + ctx.dbuser.location + ' now.'
    );
    getWeather(ctx);

    return ctx.scene.leave();
  } catch (e) {
    console.log(e);
  }
});

stepHandler.action('false_location', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.reply('Lets try once again');
  return ctx.scene.reenter();
});

stepHandler.use((ctx) => ctx.replyWithMarkdown('Make your choice, please'));

//confirmation of current user location
const confirmLocation = async (location, ctx) => {
  let url = encodeURI(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.location_key}&q=${location}&format=json`
  );

  console.log('LOCATION \t' + url);
  try {
    let res = await axios.get(url);
    let address = await res.data[0].display_name;

    ctx.dbuser.confirm.latitudeLocation = await res.data[0].lat;
    ctx.dbuser.confirm.longtitudeLocation = await res.data[0].lon;
    await ctx.dbuser.save();

    return address;
  } catch (err) {
    console.log(err.response.data);
    //await ctx.reply('deleting prev (incorrect) message');
    await ctx.reply('Your location is not found. Wanna try again?');
    return false;
  }
};

//function gets a weather report for user's location coords
//and replies it to user if possible (no errors)
const getWeather = async (ctx) => {
  let url = encodeURI(
    `http://www.7timer.info/bin/civillight.php?lon=${ctx.dbuser.longtitudeLocation}&lat=${ctx.dbuser.latitudeLocation}&ac=0&unit=metric&output=json&tzshift=0`
  );
  try {
    let res = await axios.get(url);
    let fullWeather = await res.data.dataseries[0];
    let usrWeather = await fullWeather.weather;

    ctx.reply(`Weather: ${usrWeather}`);
  } catch (error) {
    console.log(error);
    ctx.reply("Sorry, can't get weather for you");
  }
};

const stage = new Stage();
stage.register(location);

bot.use(session());
bot.use(stage.middleware());
bot.command('location', (ctx) => ctx.scene.enter('location'));
bot.launch();
