import axios from 'axios';

// API key from .env file
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
// openWeatherMap API base URL
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// function to get current weather
export function getWeather(location) {
  // if no location provided, use Nairobi as default
  if (!location) {
    location = 'Nairobi';
  }
  
  // build the full URL
  const url = BASE_URL + '/weather';
  
  // make API call
  return axios.get(url, {
    params: { 
      appid: API_KEY,
      q: location,
      units: 'metric'
    }
  })
  .then(function(response) {
    // return weather data
    return response.data;
  })
  .catch(function(error) {
    // handle errors
    console.error('Weather fetch error:', error);
    throw error;
  });
}

// function to get weather forecast
export function getForecast(location, days) {
  // if no location provided, use Nairobi
  if (!location) {
    location = 'Nairobi';
  }
  // if no days provided, use 3 days
  if (!days) {
    days = 3;
  }
  
  // build the full URL 
  const url = BASE_URL + '/forecast';
  // calculate data points (8 per day)
  const count = days * 8;
  
  // make API call
  return axios.get(url, {
    params: { 
      appid: API_KEY,
      q: location,
      cnt: count,
      units: 'metric'
    }
  })
  .then(function(response) {
    // return forecast data
    return response.data;
  })
  .catch(function(error) {
    // handle errors
    console.error('Forecast fetch error:', error);
    throw error;
  });
}
