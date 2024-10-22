import React, { useState } from 'react';
import '../styles/searchBar.css'
import { FaLocationCrosshairs } from "react-icons/fa6";

const SearchBar = ({ onSearch, lastSearchedCities, toggleUnit, unit, handleCurrentLocation }) => {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city) {
            onSearch(city);
            setCity('');
        }
    };

    return (
        <div className='search-bar'>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        className='input-search'
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                    />
                    <button className='search-btn' type="submit">Search</button>
                </div>

                <div>
                    <button onClick={handleCurrentLocation}><FaLocationCrosshairs /></button>
                    <button className='unit-btn' onClick={toggleUnit}>Switch to °{unit === 'C' ? 'F' : 'C'}</button>
                </div>
            </form>
            {
                lastSearchedCities.length > 0 &&
                <div className='searchListWrapper'>
                    <h4 className='search-heading'>Recent Searched Cities:</h4>
                    <ul className='searchList'>
                        {lastSearchedCities.map((city, index) => (
                            <li key={index} onClick={() => onSearch(city)}>{city}</li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default SearchBar;
