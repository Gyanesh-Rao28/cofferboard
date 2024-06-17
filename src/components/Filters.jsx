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

                setYears(uniqueYears);
                setTopics(uniqueTopics);
                setSectors(uniqueSectors);
                setRegions(uniqueRegions);
                setPestles(uniquePestles);
                setSources(uniqueSources);
                setCountries(uniqueCountries);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
        <div className="flex flex-col p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mb-6">
                <label htmlFor="endYear" className="block text-sm font-medium text-gray-700">End Year:</label>
                <select id="endYear" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {years && years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-md font-medium  text-gray-900">Topics:</label>
                <div className="space-y-2">
                    {topics && topics.map(topic => (
                        <div key={topic} className="flex items-center">
                            <input type="checkbox" id={`topic_${topic}`} name="topic" value={topic} onChange={handleFilterChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor={`topic_${topic}`} className="ml-2 block text-sm text-gray-900">{topic}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector:</label>
                <select id="sector" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {sectors && sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region:</label>
                <select id="region" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {regions && regions.map(region => <option key={region} value={region}>{region}</option>)}
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="pestle" className="block text-sm font-medium text-gray-700">PESTLE:</label>
                <select id="pestle" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {pestles && pestles.map(pestle => <option key={pestle} value={pestle}>{pestle}</option>)}
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source:</label>
                <select id="source" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {sources && sources.map(source => <option key={source} value={source}>{source}</option>)}
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country:</label>
                <select id="country" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {countries && countries.map(country => <option key={country} value={country}>{country}</option>)}
                </select>
            </div>

            {/* Uncomment this section if cities are to be included again.
            <div className="mb-6">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
                <select id="city" onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700">
                    <option value="">All</option>
                    {cities && cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
            </div>
            */}

            <button onClick={handleSubmit} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>

            <Dashboard selectedFilters={selectedFilters} />
        </div>
    );
};

export default FilterBtns;
