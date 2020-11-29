const printWeather = (fullWeather) => {
  return `Погода сегодня: ${fullWeather.weather[0].description}.

🌡Температура: 
    - Утром: ${Math.round(fullWeather.temp.morn)}°C
    - Днем: ${Math.round(fullWeather.temp.day)}°C
    - Вечером: ${Math.round(fullWeather.temp.eve)}°C
🌪Ветер: ${Math.round(fullWeather.wind_speed)} м/сек
💧Влажность: ${fullWeather.humidity}%
☔️Вероятность осадков: ${fullWeather.pop * 100}%`;
};

module.exports = { printWeather };
