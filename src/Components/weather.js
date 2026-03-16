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

  
    
      document.title = "React Weather App";
    
  function cityChange(event) {
    setCity(event.target.value);
  }

  async function fetchdata() {
    // url aur fetch dono try ke andar — sahi jagah
    try {
  const apiKey = "df15ecb408ec75e68cf4bb7463f0fcd9";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      let response = await fetch(url);
      let output = await response.json();

      if (response.ok) {
        setWeather(output);
        setError("");
        console.log(output);
      } else {
        setError("No Data Found, Please Enter A Valid City Name");
        setWeather(null); // purana data clear karo
      }
    } catch (err) {
      setError("Network error! Check your connection.");
      setWeather(null);
    }
  }

  return (
    <div className="container">
      <input
        placeholder="Enter city name"
        type="text"
        value={city}
        onChange={cityChange}
      />

      <button className="city" onClick={fetchdata}>
        <IoMdSearch />
      </button>

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
              {weather.main.temp}
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
              <div className="wind-speed">{weather.wind.speed}</div>
              <div className="wind-head">WIND SPEED</div>
            </div>

            <div className="humidity">
              <div className="weathhumidity">
                <WiHumidity />
              </div>
              <div className="humidity-speed">{weather.main.humidity}</div>
              <div className="humidity-head">HUMIDITY</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;