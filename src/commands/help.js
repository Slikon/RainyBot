const helpCommand = (ctx) => {
  ctx.reply(
    `Here is a list of commands:\n/location - enter your current location\n/check - check your last saved location`
  );
};

module.exports = { helpCommand };
