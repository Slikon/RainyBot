const dotenv = require('dotenv').config();
const Telegraf = require('telegraf');
const mongoose = require('mongoose');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const bot = new Telegraf(process.env.BOT_TOKEN);
const databaseUrl = process.env.MONGO_URL;
const User = require('./models/user');
const cron = require('node-cron');
const { checkWeather } = require('./utils/checkWeather');
const { checkCommand } = require('./commands/check');
const { helpCommand } = require('./commands/help');
const { locationCommand } = require('./commands/location');
const { location } = require('./scenes/location');

// connection to MongoDB
const connect = mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect
  .then(() => {
    console.log('Connected succesfully to the server!');
  })
  .catch((err) => {
    console.log(err);
  });

bot.use(async (ctx, next) => {
  // searching for user by id
  let user = await User.findOne({ id: ctx.from.id });
  // if no such user - create one
  if (!user) {
    user = await User.create({
      id: ctx.from.id,
    });
  }
  ctx.dbuser = user;
  next();
});

bot.start((ctx) => {
  ctx.reply('Bot started!\nType /help to see what I can!');
});

bot.help(helpCommand);
bot.command('check', checkCommand);
bot.command('location', locationCommand);

// scheduler of the weather checking event. If the weather is rainy/snowy today - the bot will warn you at specific time!
cron.schedule('0 06 23 * * *', async () => {
  checkWeather();
});

const stage = new Stage();
stage.register(location);

bot.use(session());
bot.use(stage.middleware());
bot.launch();
