// for interacting with the APIs

// Can only create one app on AccuWeather, 50 request per day.
// Cebu City = 262768
// Abu Dhabi= 321626

class Forecast {
  constructor() {
    this.key = 'Kekg3XBetR6VjMXYW3UqKcRMui4xmHGm';
    this.cityURI = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    this.weatherURI = 'https://dataservice.accuweather.com/currentconditions/v1/';
    this.Forecast4DaysURI = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  }
  // get the city inputted by the user and starts the requests
  async updateCity(cityInput) {
    const cityDetails = await this.getCity(cityInput);
    const weather = await this.getWeather(cityDetails.Key);
    const forecast = await this.get4DaysForecast(cityDetails.Key);
    return { cityDetails, weather, forecast };
  }
  // get city information
  async getCity(cityInput) {
    const query = `?apikey=${this.key}&q=${cityInput}`;
    const response = await fetch(this.cityURI + query); 
    const data = await response.json();
    return data[0]; // this returns a promise because it is in a async function
  }
  // get weather information
  async getWeather(cityCode) {
    const query = `${cityCode}?apikey=${this.key}`;
    const response = await fetch(this.weatherURI + query);  
    const data = await response.json();
    return data[0];
  }
  // get 4 days of weather forecast
  async get4DaysForecast(cityCode) {
    const query = `${cityCode}?apikey=${this.key}&metric=true`;
    const response = await fetch(this.Forecast4DaysURI + query);
    const data = await response.json();
    return data;
  }
}






 