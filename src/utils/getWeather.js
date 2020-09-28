const axios = require('axios');

//function returns a weather report for user's location coords
const getWeather = async (user) => {
  let url = encodeURI(
    `http://www.7timer.info/bin/civillight.php?lon=${user.longtitudeLocation}&lat=${user.latitudeLocation}&ac=0&unit=metric&output=json&tzshift=0`
  );
  try {
    let res = await axios.get(url);
    let fullWeather = await res.data.dataseries[0];
    let usrWeather = await fullWeather.weather;

    return usrWeather;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { getWeather };
