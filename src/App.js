import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Card from './components/MainForecastCard';
import DayWiseForecastCard from './components/DayWiseForecastCard';
import './App.css';
import { fetchForecast, fetchWeather } from './utils';
import { apiKey } from './apiKey';
import Loader from './components/Loader';

// conver temperature Celcius to Fahrenheit
const convertTemp = (temp, unit) => {
    return unit === 'C' ? temp : (temp * 9 / 5 + 32).toFixed(1);
};

const App = () => {
    // handle states
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState('');
    const [unit, setUnit] = useState('C');
    const [lastSearchedCities, setLastSearchedCities] = useState([]);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const savedCities = JSON.parse(localStorage.getItem('lastSearchedCities')) || [];
        setLastSearchedCities(savedCities);
    }, []);

    const handleSearch = (city) => {
        fetchWeather(city, unit, setWeather, setForecast, lastSearchedCities, setLastSearchedCities, setError, setLoading);
    };

    const toggleUnit = () => {
        setUnit(prevUnit => (prevUnit === 'C' ? 'F' : 'C'));
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setLoading(true)
                    const { latitude: lat, longitude: lon } = position.coords;

                    const unitParam = unit === 'C' ? 'metric' : 'imperial';

                    try {
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitParam}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch weather data');
                        }

                        const data = await response.json();

                        const currentTemp = data.main.temp;
                        const humidity = data.main.humidity;
                        const windSpeed = data.wind.speed;

                        // update the state with the fetched weather data
                        setWeather({
                            city: 'Your Location',
                            temp: currentTemp,
                            humidity: humidity,
                            windSpeed: windSpeed,
                        });

                        // fetch the forecast for the current location
                        const forecastData = await fetchForecast(lat, lon, unit);
                        setForecast(forecastData);
                        setError('')
                    } catch (error) {
                        setError(error.message || 'Error fetching weather data');
                    }
                    setLoading(false)
                },
                (error) => {
                    setError('Geolocation is not enabled or permission denied.');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="App">
            <SearchBar
                onSearch={handleSearch}
                lastSearchedCities={lastSearchedCities}
                toggleUnit={toggleUnit}
                unit={unit}
                handleCurrentLocation={handleCurrentLocation}
            />

            <div className='wrapper'>
                {loading ? <Loader /> :
                    <>
                        {!weather && forecast.length === 0 && !error && <p className='error'>Start searching weather by cities</p>}
                        {error && <p className='error'>{error}</p>}
                        {!error && weather && <Card unit={unit} weather={{ ...weather, temp: convertTemp(weather.temp, unit) }} />}
                        {!error && forecast.length > 0 && <DayWiseForecastCard unit={unit} forecast={forecast.map(day => ({
                            ...day,
                            temp: convertTemp(day.temp, unit),
                        }))} />}                        
                    </>
                }
            </div>
        </div>
    );
};

export default App;
