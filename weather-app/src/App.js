import React, { useState } from 'react';
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
  const [forecast, setForecast] = useState({});

  const search = evt => {
    if(evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&zip=${query}&units=imperial&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery(`${result}`);
         
          fetch(`${api.base}onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&units=imperial&appid=${api.key}`)
            .then(res => res.json())
            .then(result => {
              setForecast(result);
              if(result.cod === "404" || result.cod === "400") {
                alert("Please enter a valid city and country (or zip code).");
              }
            });

          if(result.cod === "404" || result.cod === "400") {
            alert("Please enter a valid city and country (or zip code).");
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

  const nextDays = (num) => {
    let days = [
      "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"
    ];
    var day = new Date();
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + num);

    let today = days[nextDay.getDay()]

    return `${today}`
  }


  return (
    <div className="app">
      <div className="web-title m-5 font-bold italic">
        Optimum Weather Website
      </div>
      <main>
        <div className="text-center md:text-left m-10">
          <input
          spellCheck="false"
          type="text"
          placeholder="City, Country OR Zip Code" 
          onKeyPress={search} 
          onChange={e => setQuery(e.target.value)}
          />
        </div>
        {(typeof weather.main != "undefined" && typeof forecast.hourly != "undefined") ? (
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
            <span>H:{Math.round(weather.main.temp_max)}&deg;&nbsp;</span>
            <span>L:{Math.round(weather.main.temp_min)}&deg;</span>
            <div className="mb-5">
              {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="m-10 text-center">
                <div className="text-left">
                  DETAILS
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
                      <div className="wi wi-raindrops text-2xl" />
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
              {/* Weekly */}
              <div className="m-10 text-center">
                <div className="text-left">
                  NEXT 7 DAYS
                </div>
                <div className="inline-grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className={
                        (typeof forecast.daily[1].weather[0].id >= 21 && forecast.daily[1].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[0].weather[0].id >= 300 && forecast.daily[1].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[1].weather[0].id >= 500 && forecast.daily[1].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[1].weather[0].id >= 600 && forecast.daily[1].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[1].weather[0].id >= 701 && forecast.daily[1].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[1].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }/>
                      <div>{nextDays(1)}</div>
                      <span>{Math.round(forecast.daily[1].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[1].temp.min)}&deg;</span>
                    </div>
                  </div>
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className={
                        (typeof forecast.daily[2].weather[0].id >= 21 && forecast.daily[2].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[2].weather[0].id >= 300 && forecast.daily[2].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[2].weather[0].id >= 500 && forecast.daily[2].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[2].weather[0].id >= 600 && forecast.daily[2].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[2].weather[0].id >= 701 && forecast.daily[2].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[2].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }
                      />
                      <div>{nextDays(2)}</div>
                      <span>{Math.round(forecast.daily[2].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[2].temp.min)}&deg;</span>
                    </div>
                  </div>
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className={
                        (typeof forecast.daily[3].weather[0].id >= 21 && forecast.daily[3].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[3].weather[0].id >= 300 && forecast.daily[3].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[3].weather[0].id >= 500 && forecast.daily[3].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[3].weather[0].id >= 600 && forecast.daily[3].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[3].weather[0].id >= 701 && forecast.daily[3].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[3].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }
                      />
                      <div>{nextDays(3)}</div>
                      <span>{Math.round(forecast.daily[3].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[3].temp.min)}&deg;</span>
                    </div>
                  </div>
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className= {
                        (typeof forecast.daily[4].weather[0].id >= 21 && forecast.daily[4].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[4].weather[0].id >= 300 && forecast.daily[4].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[4].weather[0].id >= 500 && forecast.daily[4].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[4].weather[0].id >= 600 && forecast.daily[4].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[4].weather[0].id >= 701 && forecast.daily[4].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[4].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }
                      />
                      <div>{nextDays(4)}</div>
                      <span>{Math.round(forecast.daily[4].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[4].temp.min)}&deg;</span>
                    </div>
                  </div>
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className={
                        (typeof forecast.daily[5].weather[0].id >= 21 && forecast.daily[5].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[5].weather[0].id >= 300 && forecast.daily[5].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[5].weather[0].id >= 500 && forecast.daily[5].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[5].weather[0].id >= 600 && forecast.daily[5].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[5].weather[0].id >= 701 && forecast.daily[5].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[5].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }
                      />
                      <div>{nextDays(5)}</div>
                      <span>{Math.round(forecast.daily[5].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[5].temp.min)}&deg;</span>
                    </div>
                  </div>
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className={
                        (typeof forecast.daily[6].weather[0].id >= 21 && forecast.daily[6].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[6].weather[0].id >= 300 && forecast.daily[6].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[6].weather[0].id >= 500 && forecast.daily[6].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[6].weather[0].id >= 600 && forecast.daily[6].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[6].weather[0].id >= 701 && forecast.daily[6].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[6].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }
                      />
                      <div>{nextDays(6)}</div>
                      <span>{Math.round(forecast.daily[6].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[6].temp.min)}&deg;</span>
                    </div>
                  </div>
                  <div className="cards">
                    <div className="content shadow-md">
                      <i className={
                        (typeof forecast.daily[7].weather[0].id >= 21 && forecast.daily[7].weather[0].id <= 232) 
                        ? "wi wi-thunderstorm text-5xl" : forecast.daily[7].weather[0].id >= 300 && forecast.daily[7].weather[0].id <= 321 
                        ? "wi wi-sleet text-5xl" : forecast.daily[7].weather[0].id >= 500 && forecast.daily[7].weather[0].id <= 531
                        ? "wi wi-showers text-5xl" : forecast.daily[7].weather[0].id >= 600 && forecast.daily[7].weather[0].id <= 622
                        ? "wi wi-snow text-5xl" : forecast.daily[7].weather[0].id >= 701 && forecast.daily[7].weather[0].id <= 781
                        ? "wi wi-fog text-5xl" : forecast.daily[7].weather[0].id === 800
                        ? "wi wi-day-sunny text-5xl": "wi wi-day-fog text-5xl"
                      }
                      />
                      <div>{nextDays(7)}</div>
                      <span>{Math.round(forecast.daily[7].temp.max)}&deg;&nbsp;</span>
                      <span className="forecast-min">{Math.round(forecast.daily[7].temp.min)}&deg;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
        ) : 
        (<div className="text-center md:text-left m-10">
          Enter a location to get started!
        </div>
        )}
      </main>
      <footer className="p-2">© Brandon Ramirez 2021</footer>
    </div>
  );

}

export default App;