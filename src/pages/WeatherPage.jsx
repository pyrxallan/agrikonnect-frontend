import { useState, useEffect } from 'react';
import { getWeather, getForecast } from '../services/weatherService';

// weather page component that displays current weather and 3-day forecast
const WeatherPage = () => {
  // state management for weather data, loading status, and search functionality
  const [weather, setWeather] = useState(null); // it stores current weather data
  const [forecast, setForecast] = useState(null); // it stores forecast data
  const [loading, setLoading] = useState(true); // tracks if data is being fetched
  const [location, setLocation] = useState('Nairobi'); // current location to fetch weather for
  const [searchInput, setSearchInput] = useState(''); // user input for city search

  // fetch weather data when location changes and the useEffect runs whenever the 'location' state changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // promise.all fetches both current weather and forecast simultaneously
        const [weatherData, forecastData] = await Promise.all([
          getWeather(location),
          getForecast(location, 3)
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [location]); // dependency array it runs when location changes

  // handle search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // prevent page reload on form submit
    if (searchInput.trim()) setLocation(searchInput.trim()); // update location if input is not empty
  };

  // loading state to shown when fetching data from the weather api
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex  items-center justify-center">
      <div className="text-center">
         <p className="text-gray-600">Loading weather...</p>
        </div>
    </div>
  );

  // error state to show when data fetch fails
  if (!weather || !forecast) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-600">Unable to load weather data</p>
    </div>
  );

  // we get 3-day forecast from API data and returns data in 3 hours intervals
  const dailyForecast = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 3);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/farm_page.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Weather Forecast</h1>

        {/* search form that allows users to search for different cities */}
        <form onSubmit={handleSearch} className="glass bg-white/40 rounded-3xl p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a city..."
              className=" glass bg-white/40 flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <button type="submit" className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary/90">
              Search
            </button>
          </div>
        </form>

        {/* displays real-time weather data */}
        <div className="glass bg-white/40 p-8 rounded-3xl mb-8">

          <h2 className="text-2xl font-semibold mb-2">{weather.name}, {weather.sys.country}</h2>
          <p className="text-6xl font-bold text-secondary mb-2">{Math.round(weather.main.temp)}°C</p>
          <p className="text-xl capitalize">{weather.weather[0].description}</p>
          
          {/* a simple weather deatils to shows humidity, wind, pressure, visibility */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4 ">
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-2xl font-bold">{weather.main.humidity}%</p>
            </div>
            <div className="text-center p-4 ">
              <p className="text-sm text-gray-600">Wind</p>
              {/* convert wind speed from m/s to km/h by multiplying by 3.6 */}
              <p className="text-2xl font-bold">{Math.round(weather.wind.speed * 3.6)} km/h</p>
            </div>
            <div className="text-center p-4 ">
              <p className="text-sm text-gray-600">Pressure</p>
              <p className="text-2xl font-bold">{weather.main.pressure} mb</p>
            </div>
            <div className="text-center p-4 ">
              <p className="text-sm text-gray-600">Visibility</p>
              {/* convert visibility from meters to kilometers */}
              <p className="text-2xl font-bold">{(weather.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        </div>

        {/* 3-Day Forecast Card it displays weather predictions for next 3 days */}
        <div className="glass bg-white/40 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-6">3-Day Forecast</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* map through daily forecast data and display each day */}
            {dailyForecast.map((day) => (
              <div key={day.dt} className="p-6 rounded-2xl">
                <p className="font-semibold mb-2">
                  {new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                {/* displays temperature and min/max range */}
                <p className="text-3xl font-bold text-secondary">{Math.round(day.main.temp)}°C</p>
                <p className="text-sm text-gray-600">{Math.round(day.main.temp_min)}° / {Math.round(day.main.temp_max)}°</p>
                <p className="capitalize mt-2">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;