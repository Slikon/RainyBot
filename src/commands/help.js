const helpCommand = (ctx) => {
  ctx.reply(
    `Hi! This bot is created to warn you about possible weather precipitations in your region. I usually forget to check out the weather and grab an umbrella, that's why managed to create this bot.\n\nEnter your location and that's all! If precipitations are expected today, I would notice you automatically at 03:00 (UTC). All notifications are sent automatically and you don't need to configure me. Enjoy!
  \n\nHere is a list of commands:\n/location - save your current location so I would know where you are :)\n/check - check your last saved location and recieve your weather forecast for today!`
  );
};

module.exports = { helpCommand };
