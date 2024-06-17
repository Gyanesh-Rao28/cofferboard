import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

const FilterBtns = () => {
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);
    const [topics, setTopics] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [regions, setRegions] = useState([]);
    const [pestles, setPestles] = useState([]);
    const [sources, setSources] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        endYear: '',
        topics: [],
        sector: '',
        region: '',
        pestle: '',
        source: '',
        country: '',

    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://coffer-api.vercel.app/api/v1/getAnalytic');
                const uniqueYears = [...new Set(response.data.map(item => item.end_year))];
                const uniqueTopics = [...new Set(response.data.map(item => item.topic))];
                const uniqueSectors = [...new Set(response.data.map(item => item.sector))];
                const uniqueRegions = [...new Set(response.data.map(item => item.region))];
                const uniquePestles = [...new Set(response.data.map(item => item.pestle))];
                const uniqueSources = [...new Set(response.data.map(item => item.source))];
                const uniqueCountries = [...new Set(response.data.map(item => item.country))];
                // const uniqueCities = [...new Set(response.data.map(item => item.city))];

                setYears(uniqueYears);
                setTopics(uniqueTopics);
                setSectors(uniqueSectors);
                setRegions(uniqueRegions);
                setPestles(uniquePestles);
                setSources(uniqueSources);
                setCountries(uniqueCountries);
                // setCities(uniqueCities);

                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on component mount

    const handleFilterChange = (e) => {
        const { id, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setSelectedFilters(prevFilters => ({
                ...prevFilters,
                topics: checked
                    ? [...prevFilters.topics, value]
                    : prevFilters.topics.filter(topic => topic !== value),
            }));
        } else {
            setSelectedFilters(prevFilters => ({
                ...prevFilters,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.get('https://coffer-api.vercel.app/api/v1/getAnalytic/getFilterData', {
                params: selectedFilters,
            });

            setData(response.data);
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };
    return (
        <div>
            <label htmlFor="endYear">End Year:</label>
            <select id="endYear" onChange={handleFilterChange}>
                <option value="">All</option>
                {years && years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>

            <label>Topics:</label>
            {topics && topics.map(topic => (
                <div key={topic}>
                    <input type="checkbox" id={`topic_${topic}`} name="topic" value={topic} onChange={handleFilterChange} />
                    <label htmlFor={`topic_${topic}`}>{topic}</label>
                </div>
            ))}

            <label htmlFor="sector">Sector:</label>
            <select id="sector" onChange={handleFilterChange}>
                <option value="">All</option>
                {sectors && sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
            </select>

            <label htmlFor="region">Region:</label>
            <select id="region" onChange={handleFilterChange}>
                <option value="">All</option>
                {regions && regions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>

            <label htmlFor="pestle">PESTLE:</label>
            <select id="pestle" onChange={handleFilterChange}>
                <option value="">All</option>
                {pestles && pestles.map(pestle => <option key={pestle} value={pestle}>{pestle}</option>)}
            </select>

            <label htmlFor="source">Source:</label>
            <select id="source" onChange={handleFilterChange}>
                <option value="">All</option>
                {sources && sources.map(source => <option key={source} value={source}>{source}</option>)}
            </select>

            <label htmlFor="country">Country:</label>
            <select id="country" onChange={handleFilterChange}>
                <option value="">All</option>
                {countries && countries.map(country => <option key={country} value={country}>{country}</option>)}
            </select>

            {/* <label htmlFor="city">City:</label>
            <select id="city" onChange={handleFilterChange}>
                <option value="">All</option>
                {cities && cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select> */}

            <button onClick={handleSubmit}>Submit</button>
            <Dashboard selectedFilters={selectedFilters} />
        </div>
    );
};

export default FilterBtns;