const printWeather = (fullWeather) => {
  return `Погода сегодня: ${fullWeather.weather[0].description}.

    🌡Температура, °C: 
    - Утром: ${Math.round(fullWeather.temp.morn)}
    - Днем: ${Math.round(fullWeather.temp.day)}
    - Вечером: ${Math.round(fullWeather.temp.eve)}
    🌪Ветер, м/сек: ${Math.round(fullWeather.wind_speed)}
    💧Влажность, %: ${fullWeather.humidity}
    ☔️Вероятность осадков, %: ${fullWeather.pop * 100}`;
};

module.exports = { printWeather };
