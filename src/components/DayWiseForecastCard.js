import React from 'react';
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaTemperatureLow } from "react-icons/fa";
import '../styles/dayWiseForecastCard.css'

// format day
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    return `${day}${suffix(day)} ${date.toLocaleDateString('en-GB', { month: 'short' })}`;
};


const DayWiseForecastCard = ({ unit, forecast }) => {

    return (
        <div className="day-wise-forecast-card">
            {forecast.map((day, index) => (
                <div key={index} className="forecast">
                    <h3>{formatDate(day.date)}</h3>
                    <p><FaTemperatureLow style={{
                        color: 'orange'
                    }} />{day.temp} °{unit}</p>
                    <p><TiWeatherPartlySunny style={{
                        color: 'yellow'
                    }} />{day.condition}</p>
                </div>
            ))}
        </div>
    );
};

export default DayWiseForecastCard;
