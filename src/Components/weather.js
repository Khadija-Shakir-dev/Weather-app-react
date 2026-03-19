import React, { useState, useEffect } from "react";
import "./weather.css";
import { IoMdSearch } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Suggestion fetching using GeoDB
  useEffect(() => {
    if (city.length > 1) {
      const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}&limit=10`;

      fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "3743ad9943mshe0a83f22821232bp145273jsn2b6b274228fb",
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const citiesOnly = data.data.filter((item) => item.type === "CITY");
          setSuggestions(citiesOnly);
        })
        .catch((err) => {
          console.error("Error fetching city suggestions", err);
        });
    } else {
        setSuggestions([]);
        setWeather(null);
        setError("");
    }
  }, [city]);

  // Set page title
  document.title = "React Weather App";

  // Input change
  function cityChange(event) {
    setCity(event.target.value);
  }

  // Click on suggestion – passing coordinates for 100% accuracy
  function handleSuggestionClick(suggestion) {
    setCity(`${suggestion.name}, ${suggestion.countryCode}`);
    setSuggestions([]);
    // Use latitude and longitude to avoid naming confusion
    fetchdata(suggestion.latitude, suggestion.longitude);
  }

  // Fetch weather from OpenWeather API using Coordinates
  async function fetchdata(lat, lon) {
    const apiKey = "df15ecb408ec75e68cf4bb7463f0fcd9";
    // Fixed URL using lat/lon instead of city name
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    try {
      let response = await fetch(url);
      let output = await response.json();
  
      if (response.ok) {
        setWeather(output);
        setError("");
      } else {
        setError("No Data Found, Please Enter A Valid City Name");
        setWeather(null);
      }
    } catch (err) {
      setError("Network error! Check your connection.");
      setWeather(null);
    }
  }

  return (
    <div className="container">
      <div className="search-box">
        <input
          placeholder="Enter city name"
          type="text"
          value={city}
          onChange={cityChange}
        />

        <button
          className="city"
          onClick={() => {
            if (suggestions.length > 0) {
              // Automatically picks the most relevant suggestion's coordinates
              handleSuggestionClick(suggestions[0]);
            }
          }}
        >
          <IoMdSearch />
        </button>
      </div>

      {/* Suggestions list */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="sug-name">{suggestion.name}</span>
              <span className="sug-country">{suggestion.countryCode}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-msg">{error}</p>}

      {weather && weather.weather && (
        <div className="content">
          <div className="weather-img">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <h3 className="description">{weather.weather[0].description}</h3>
          </div>

          <div className="weather-temp">
            <h3>
              {Math.round(weather.main.temp)}
              <span>&deg;C</span>
            </h3>
          </div>

          <div className="weather-city">
            <div className="weather-location">
              <FaLocationDot />
            </div>
            <span>
              {weather.name}, {weather.sys.country}
            </span>
          </div>

          <div className="weather-stats">
            <div className="wind">
              <div className="weather-wind">
                <FaWind />
              </div>
              <div className="wind-speed">{weather.wind.speed} m/s</div>
              <div className="wind-head">WIND SPEED</div>
            </div>

            <div className="humidity">
              <div className="weathhumidity">
                <WiHumidity />
              </div>
              <div className="humidity-speed">{weather.main.humidity}%</div>
              <div className="humidity-head">HUMIDITY</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
