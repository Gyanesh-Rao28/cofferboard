import React, { useState } from 'react';
import Dashboard from './Dashboard'
import FilterBtns from './Filters';

const FilterContainer = () => {
    const [filters, setFilters] = useState({});

    const handleFilterChange = (newFilters) => {

        console.log('Filters changed:', newFilters);

        setFilters(newFilters);
    };

    return (
        <div>
            <FilterBtns onFilterChange={handleFilterChange} />
            <Dashboard filters={filters} />
        </div>
    );
};

export default FilterContainer;