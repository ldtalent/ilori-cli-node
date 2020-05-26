const Axios = require('axios');

class Weather {
  constructor() { }

  async getWeather(cityName) {
    const ApiKey = 'YOUR_API_KEY';
    const Url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${ApiKey}`;

    await Axios.get(Url)
    .then(function (resp) {
      let response = resp.data;
      console.log('************** Current Weather ******************');
      console.log(`Description: ${response.weather[0].main}`);
      console.log('**************************************************');
      console.log(`Minimum Temperature: ${response.main.temp_min}`);
      console.log('**************************************************');
      console.log(`Maximum Temperature: ${response.main.temp_max}`);
      console.log('**************************************************');
      console.log(`Feels Like: ${response.main.feels_like}`);
      console.log('************** Current Weather ******************');
    })
    .catch(function (error) {
      console.log(error);
    });
    return;
  }
}

module.exports = new Weather();
