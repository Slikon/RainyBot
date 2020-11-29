const axios = require('axios');

//function returns a weather report for user's location coords
const getWeather = async (user) => {
  const url = encodeURI(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${user.latitudeLocation}&lon=${user.longtitudeLocation}&units=metric&exclude=current,minutely,hourly&appid=${process.env.WEATHER_KEY}`
  );
  try {
    const res = await axios.get(url);
    console.log(url);
    // let fullWeather = await res.data.daily[0].weather[0];
    const fullWeather = await res.data.daily[0];
    // let usrWeather = await fullWeather.description;

    // console.log(usrWeather);
    return fullWeather;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { getWeather };
