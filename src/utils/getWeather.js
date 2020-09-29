const axios = require('axios');

//function returns a weather report for user's location coords
const getWeather = async (user) => {
  let url = encodeURI(
    `http://api.openweathermap.org/data/2.5/weather?lat=${user.latitudeLocation}&lon=${user.longtitudeLocation}&appid=${process.env.weather_key}`
  );
  try {
    let res = await axios.get(url);
    let fullWeather = await res.data.weather[0];
    let usrWeather = await fullWeather.description;

    return usrWeather;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { getWeather };
