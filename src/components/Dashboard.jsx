import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import * as d3 from 'd3';
import styles from "./dashboard.module.css"
import "chart.js/auto";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [topics, setTopics] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://coffer-api.vercel.app/api/v1/getAnalytic');
            setData(response.data);

            const uniqueCountries = [...new Set(response.data.map(entry => entry.country))];
            const uniqueSectors = [...new Set(response.data.map(entry => entry.sector))];
            const uniqueTopics = [...new Set(response.data.map(entry => entry.topic))];
            const uniqueYears = [...new Set(response.data.map(entry => entry.published?.slice(0, 4)))];

            setCountries(['', ...uniqueCountries]);
            setSectors(['', ...uniqueSectors]);
            setTopics(['', ...uniqueTopics]);
            setYears(['', ...uniqueYears]);
        } catch (error) {
            console.error('Error retrieving data:', error.message);
        }
    };

    const filteredData = data.filter(entry => {
        return (
            (!selectedCountry || entry.country === selectedCountry) &&
            (!selectedSector || entry.sector === selectedSector) &&
            (!selectedTopic || entry.topic === selectedTopic) &&
            (!selectedYear || entry.published?.includes(selectedYear))
        );
    });

    const chartDataIntensity = {
        labels: filteredData
            .map(entry => entry.likelihood)
            .filter(value => value !== null)
            .map(value => value.toString())
            .sort(),
        datasets: [
            {
                label: 'Intensity',
                data: filteredData
                    .filter(entry => entry.likelihood !== null)
                    .slice()
                    .sort((a, b) => a.likelihood?.toString().localeCompare(b.likelihood?.toString()))
                    .map(entry => entry.intensity),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptionsIntensity = {
        scales: {
            xAxes: [
                {
                    type: 'category',
                    scaleLabel: {
                        display: true,
                        labelString: 'Likelihood',
                    },
                },
            ],
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Intensity',
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Likelihood-Intensity Chart',
            },
        },
    };

    const chartDataRelevance = {
        labels: filteredData.map(entry => entry.region),
        datasets: [
            {
                label: 'Relevance',
                data: filteredData.map(entry => entry.relevance),
                backgroundColor: ['rgba(255,99,132,0.2)', 'rgba(255,205,86,0.2)', 'rgba(54,162,235,0.2)'],
                borderColor: ['rgba(255,99,132,1)', 'rgba(255,205,86,1)', 'rgba(54,162,235,1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptionsRelevance = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
            title: {
                display: true,
                text: 'Region-Relevance pie chart',
            },
        },
    };

    useEffect(() => {
        createHistogram();
    }, [filteredData]);

    const createHistogram = () => {
        const yearIntensityValues = filteredData.map(entry => ({
            year: entry.published?.slice(0, 4),
            intensity: entry.intensity,
        }));

        yearIntensityValues.sort((a, b) => parseInt(a.year) - parseInt(b.year));

        d3.select('#histogram-container').selectAll('*').remove();

        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const svg = d3.select('#histogram-container').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand().domain(yearIntensityValues.map(d => d.year)).range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, d3.max(yearIntensityValues, d => d.intensity)]).range([height, 0]);

        svg.selectAll('rect')
            .data(yearIntensityValues)
            .enter().append('rect')
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.intensity))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.intensity))
            .style('fill', 'steelblue');

        svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale).tickFormat(d3.format('d'))); // Added tickFormat to format year as integer
        svg.append('g').call(d3.axisLeft(yScale));

        // Add labels
        svg.append('text')
            .attr('transform', `translate(${width / 2}, ${height + margin.top + 20})`) // Adjust the position
            .style('text-anchor', 'middle')
            .text('Year');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Intensity');
    };

    const chartDataCountry = {
        labels: filteredData.map(entry => entry.region),
        datasets: [
            {
                label: 'Country',
                data: filteredData.map(entry => entry.impact),
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptionsCountry = {
        scales: {
            xAxes: [
                {
                    type: 'category',
                    scaleLabel: {
                        display: true,
                        labelString: 'Country',
                    },
                },
            ],
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Some Numeric Value',
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Country intensity Chart',
            },
        },
    };


    const chartDataTopics = {
        labels: filteredData.map(entry => entry.topic),
        datasets: [
            {
                label: 'intensity',
                data: filteredData.map(entry => entry.intensity),
                backgroundColor: ['rgba(255,99,132,0.2)', 'rgba(255,205,86,0.2)', 'rgba(54,162,235,0.2)'],
                borderColor: ['rgba(255,99,132,1)', 'rgba(255,205,86,1)', 'rgba(54,162,235,1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptionsTopics = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
            title: {
                display: true,
                text: 'Topics-Intensity Doughnut Chart',
            },
        },
    };

    const topicYearData = topics.map(topic => {
        return {
            label: topic,
            data: filteredData
                .filter(entry => entry.topic === topic && entry.published)
                .map(entry => ({
                    x: entry.published.slice(0, 4),
                    y: entry.someNumericValue,
                })),
        };
    });

    const topicIntensityData = {
        labels: filteredData.map(entry => entry.topic),
        datasets: [
            {
                label: 'Intensity',
                data: filteredData.map(entry => entry.intensity),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
            },
        ],
    };

    const topicIntensityOptions = {
        scales: {
            x: {
                type: 'category',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'Topic',
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Intensity',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Topic-Intensity Relationship',
            },
        },
    };

    return (
        <div>
            <select onChange={(e) => setSelectedCountry(e.target.value)}>
                {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                ))}
            </select>

            <select onChange={(e) => setSelectedSector(e.target.value)}>
                {sectors.map((sector, index) => (
                    <option key={index} value={sector}>{sector}</option>
                ))}
            </select>

            <select onChange={(e) => setSelectedTopic(e.target.value)}>
                {topics.map((topic, index) => (
                    <option key={index} value={topic}>{topic}</option>
                ))}
            </select>

            <select onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>
            <div className={styles.charts}>
                <Bar className={styles.bar} data={chartDataIntensity} options={chartOptionsIntensity} />

                <Doughnut className={styles.pie} data={chartDataRelevance} options={chartOptionsRelevance} />

                <div id="histogram-container" />

                <Bar
                    data={chartDataCountry}
                    options={chartOptionsCountry}
                    height={200}
                    style={{ marginBottom: '20px' }}
                />

                <Doughnut
                    data={chartDataTopics}
                    options={chartOptionsTopics}
                    height={200}
                    style={{ marginBottom: '20px' }}
                />

                <Line className={styles.line} data={topicIntensityData} options={topicIntensityOptions} height={200} />
            </div>

        </div>
    );
}

export default Dashboard