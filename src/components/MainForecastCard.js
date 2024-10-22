import React from 'react';
import { FaTemperatureLow } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import '../styles/mainForecastCard.css'
import { FcGlobe } from "react-icons/fc";

const MainForecastCard = ({ unit, weather }) => {
    return (
        <div className="main-forecast-card">
            <h2>
                {weather?.city?.charAt(0)?.toUpperCase() + weather?.city?.slice(1)}
                <FcGlobe style={{
                    width: '80px',
                    height: '80px',
                }}/>
            </h2>

            <div className="forecast">
                <p className={'forecast-texts'}>
                    <FaTemperatureLow style={{
                        color: 'orange',
                        width: '30px',
                        height: '30px'
                    }} />
                    <div className='forecast-texts-wrapper'>
                        <span>Temperature:</span>
                        <span>{weather.temp} °{unit}</span>
                    </div>
                </p>
                <p className={'forecast-texts'}>
                    <WiHumidity style={{
                        color: '#b8b8ff',
                        width: '30px',
                        height: '30px'
                    }} />
                    <div className='forecast-texts-wrapper'>
                        <span>Humidity:</span>
                        <span>{weather.humidity} %</span>
                    </div>
                </p>
                <p className={'forecast-texts'}>
                    <FaWind style={{
                        color: 'skyblue',
                        width: '30px',
                        height: '30px'
                    }} />
                    <div className='forecast-texts-wrapper'>
                        <span> Wind Speed:</span>
                        <span>{weather.windSpeed} m/s</span>
                    </div>
                </p>
            </div>
        </div>
    );
};


export default MainForecastCard;
