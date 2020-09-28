const helpCommand = (ctx) => {
  ctx.reply(`Here is a list of commands:
/location - enter your current location 
/check - check your last saved location`);
};

module.exports = { helpCommand };
