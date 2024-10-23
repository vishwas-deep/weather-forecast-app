import { apiKey } from './apiKey';

const fetchCoordinates = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    const data = await response.json();

    if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
    } else {
        throw new Error('City not found');
    }
};

export const fetchForecast = async (lat, lon, unit) => {
    const unitParam = unit === 'C' ? 'metric' : 'imperial';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitParam}`);

    if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();

    const dailyForecast = data.list.reduce((acc, item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!acc[date]) {
            acc[date] = { temp: 0, humidity: 0, windSpeed: 0, count: 0, conditions: [] };
        }
        acc[date].temp += item.main.temp;
        acc[date].humidity += item.main.humidity;
        acc[date].windSpeed += item.wind.speed;
        acc[date].conditions.push(item.weather[0].description);
        acc[date].count++;
        return acc;
    }, {});

    return Object.keys(dailyForecast).slice(0, 5).map(date => ({
        date: date,
        temp: (dailyForecast[date].temp / dailyForecast[date].count).toFixed(1),
        humidity: (dailyForecast[date].humidity / dailyForecast[date].count).toFixed(1),
        windSpeed: (dailyForecast[date].windSpeed / dailyForecast[date].count).toFixed(1),
        condition: dailyForecast[date].conditions[0],
    }));
};

export const fetchWeather = async (city, unit, setWeather, setForecast, lastSearchedCities, setLastSearchedCities, setError, setLoading) => {
    setLoading(true);
    try {
        const { lat, lon } = await fetchCoordinates(city);
        const unitParam = unit === 'C' ? 'metric' : 'imperial';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitParam}`);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        if (data) {
            const currentTemp = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            setWeather({
                city: city,
                temp: currentTemp,
                humidity: humidity,
                windSpeed: windSpeed,
            });

            const forecastData = await fetchForecast(lat, lon, unit);
            setForecast(forecastData);

            // Update last searched cities
            const updatedCities = [city, ...lastSearchedCities.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
            setLastSearchedCities(updatedCities);            
            localStorage.setItem('lastSearchedCities', JSON.stringify(updatedCities));
            setError('');
        } else {
            setError('City not found or no data available');
        }
    } catch (error) {
        setError(error.message || 'Error fetching data');
    }  finally {
        setLoading(false); // Ensure loading is set to false
    }
};