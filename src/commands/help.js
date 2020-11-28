const helpCommand = (ctx) => {
  ctx.replyWithMarkdown(
    `Hi! This bot is created to warn you about possible weather precipitations in your region. 
  \nAll you need is to press /location command, answer few questions about your location (e.g. city or village - don't worry, even small villages are supported), and that's it! Notification at 03:00 (UTC) will appear *only if percipitations are expected* (e.g. rain or snow during the day). \n\nFeel free to set up different locations during the day and /check weather forecast for them, but remember - daily notification comes only once for your last saved place!
  \nHere is a list of commands:\n/location - save your current location so I would know where you are🏡\n/check - check your last saved location and recieve your short weather forecast for today!🌦`
  );
};

module.exports = { helpCommand };
