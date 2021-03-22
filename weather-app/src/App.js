import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faThermometerHalf, faWind, faCloud, faThermometerEmpty, faThermometerFull } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import 'weather-icons/css/weather-icons.css';

library.add(fab, faThermometerHalf, faWind, faCloud, faThermometerEmpty, faThermometerFull);

const api = {
  key: process.env.REACT_APP_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
const [query, setQuery] = useState('');
const [weather, setWeather] = useState({});

const search = evt => {
  if(evt.key === "Enter") {
    fetch(`${api.base}weather?q=${query}&units=imperial&appid=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
        console.log(result);
        if(result.cod === "404" || result.cod === "400") {
          alert("Please enter a valid city and country.");
        }
      });
  }
}

const dateBuilder = (d) => {
  let months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"
  ];
  let days = [
    "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`
} 

return (
  <div className="app md:h-screen">
    <div className="m-5 font-bold italic">
      Optimum Weather Website
    </div>
    <main>
      <div className="">
      <TextField 
      autoComplete="off"
      type="text"
      id="standard-basic" 
      placeholder="Search..." 
      helperText="City, Country"
      onKeyPress={search} 
      onChange={e => setQuery(e.target.value)}
      />
      </div>
      {(typeof weather.main != "undefined") ? (
        <div>
          <div className="m-5">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="m-5">
          <i className={
            (typeof weather.weather[0].id >= 200 && weather.weather[0].id <= 232) 
            ? "wi wi-thunderstorm text-5xl" : weather.weather[0].id >= 300 && weather.weather[0].id <= 321 
            ? "wi wi-sleet text-5xl" : weather.weather[0].id >= 500 && weather.weather[0].id <= 531
            ? "wi wi-showers text-5xl" : weather.weather[0].id >= 600 && weather.weather[0].id <= 622
            ? "wi wi-snow text-5xl" : weather.weather[0].id >= 701 && weather.weather[0].id <= 781
            ? "wi wi-fog text-5xl" : weather.weather[0].id === 800
            ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
          } />
          </div>
          <div>{Math.round(weather.main.temp)}&deg;F</div>
          <div className="mb-5">
            {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
          </div>
          <div className="grid md:grid-cols-2 sm:grid-cols-1">
            <div className="m-10 text-left">
              <div>
                <div className="text-left">
                  DETAILS
                </div>
              </div>
              <div className="inline-grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="cards">
                  <div className="content shadow-md">
                    <FontAwesomeIcon icon="thermometer-half" />
                    <div>Feels Like</div>
                    <div>{Math.round(weather.main.feels_like)}&deg;</div>
                  </div>
                </div>
                <div className="cards">
                  <div className="content shadow-md">
                    <FontAwesomeIcon icon="wind" />
                    <div>Wind Speed</div>
                    <div>{Math.round(weather.wind.speed)} mph</div>
                  </div>
                </div>
                <div className="cards">
                  <div className="content shadow-md">
                    <i className="wi wi-raindrops" />
                    <div>Humidity</div>
                    <div>{Math.round(weather.main.humidity)}%</div>
                  </div>
                </div>
                <div className="cards">
                  <div className="content shadow-md">
                    <FontAwesomeIcon icon="cloud" />
                    <div>Cloudiness</div>
                    <div>{Math.round(weather.clouds.all)}%</div>
                  </div>
                </div>
                <div className="cards">
                  <div className="content shadow-md">
                    <FontAwesomeIcon icon="thermometer-empty" />
                    <div>Min Temp</div>
                    <div>{Math.round(weather.main.temp_min)}&deg;</div>
                  </div>
                </div>
                <div className="cards">
                  <div className="content shadow-md">
                    <FontAwesomeIcon icon="thermometer-full" />
                    <div>Max Temp</div>
                    <div>{Math.round(weather.main.temp_max)}&deg;</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              //TODO THIS WILL BE THE FORECAST SECTION
            </div>
          </div>
        </div>
          
      ) : (<h1>Enter a location to get started!</h1>)}
      
    </main>
  </div>
);

}

export default App;