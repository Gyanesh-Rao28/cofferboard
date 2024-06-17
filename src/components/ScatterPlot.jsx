import React, { useEffect } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data }) => {
    useEffect(() => {
        // Clear previous content
        d3.select('#scatterPlot').selectAll('*').remove();

        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x)])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height - margin.bottom, margin.top]);

        // Create SVG element
        const svg = d3.select('#scatterPlot')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Add data points
        svg.selectAll('circle')
            .data(data)
            .enter().append('circle')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 5);

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }, [data]);

    return (
        <div id="scatterPlot"></div>
    );
};

export default ScatterPlot;