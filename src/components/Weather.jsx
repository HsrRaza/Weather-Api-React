/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import cloud from "../assets/Clouds.png";
import clear from "../assets/Clear.png";
import mist from "../assets/mist.png";
import rain from "../assets/Rain.png";

// Mapping weather conditions to icons
const weatherImageMap = {
  Clouds: cloud,
  Rain: rain,
  Clear: clear,
  Mist: mist,
  Haze: cloud,
};

function Weather() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  // Get weather image based on current data
  const getWeatherImage = (weather) => {
    return weatherImageMap[weather] || cloud;
  };

  // Handle text input change
  const handleCityChange = (e) => {
    setCity(e.target.value);
    // console.log(e.target.value);
    
  };

  // Fetch weather by city
  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`
      );
      const json = await res.json();

      if (json.cod === "404") {
        setError("Please enter a valid city name!");
        setData(null);
      } else {
        setData(json);
        setError('');
      }

    } catch (err) {
      setError("Network error. Please try again.");
    }

    setCity('');
  };

  // Fetch weather by current location 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_API_KEY}&units=metric`
          );
          const json = await res.json();
          setData(json);
          console.log(json);
          
        
        } catch (err) {
          setError("Failed to fetch location weather");
        }
      },
      (err) => {
        setError("Location access denied or unavailable");
      }
    );
  }, []);

  return (
    <div className='box'>
      <h2>Weather App</h2>

      <div className='small'>
        <input
          type="text"
          placeholder='Enter city name'
          value={city}
          onChange={handleCityChange}
          onKeyDown={ (e)=> e.key === "Enter" && fetchWeatherByCity()}
        />
        <button onClick={fetchWeatherByCity}>Search</button>
      </div>

      <div className='info'>
        {error && (
          <div className='error'>
            <p>{error}</p>
          </div>
        )}

        {data && data.weather && (
          <div className='weathers'>
            <h2>{data.name}</h2>
            <img
              src={getWeatherImage(data.weather[0].main)}
              alt={data.weather[0].main}
            />
            <h4>{Math.trunc(data.main.temp)}°C</h4>
            <p>{data.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
