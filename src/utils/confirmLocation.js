const axios = require('axios');

//confirmation of current user location
const confirmLocation = async (location, ctx) => {
  let url = encodeURI(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${location}&format=json`
  );

  try {
    let res = await axios.get(url);
    let address = await res.data[0].display_name;

    ctx.dbuser.confirm.latitudeLocation = await res.data[0].lat;
    ctx.dbuser.confirm.longtitudeLocation = await res.data[0].lon;
    await ctx.dbuser.save();

    return address;
  } catch (err) {
    console.log(err.response.data);
    await ctx.reply('Ваш населенный пункт не найден. Попробуем еще раз?');
    return false;
  }
};

module.exports = { confirmLocation };
