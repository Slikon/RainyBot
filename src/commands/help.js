const helpCommand = (ctx) => {
  ctx.reply(
    `Hi! This bot is created to warn you in advance, if it would be rainy/snowy in your city today. You won't forget to grab an umbrella with you in the morning anymore :D.\nEnter your location and that's all! If precipitation is expected today, I would notice you automatically at 03:00 (UTC). All notifications are sent automatically and you don't need to configure me. Enjoy!
  \nHere is a list of commands:\n/location - save your current location so I would know where you are :)\n/check - check your last saved location and recieve your weather forecast for today!`
  );
};

module.exports = { helpCommand };
