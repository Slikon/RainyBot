const helpCommand = (ctx) => {
  ctx.reply(
    `Hi! This bot is created to warn you about possible weather precipitations in your region. \nAll you need is to push /location command, fill your current location (e.g. city or village - don't worry, even small villages are supported), and forget about it! Notification at 03:00 (UTC) is sent, but only if precipitations in your town are expected - no other annoying spam.
  \n\nHere is a list of commands:\n/location - save your current location so I would know where you are :)\n/check - check your last saved location and recieve your short weather forecast for today!`
  );
};

module.exports = { helpCommand };
