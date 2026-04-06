import React from 'react';

const Opportunities = () => {
    return (
        <div>
            <h1>Opportunities Across Africa</h1>
            <div className="filter-tabs">
                <button>Jobs</button>
                <button>Tenders</button>
                <button>Grants</button>
            </div>
            <p>Aggregated listings of jobs, tenders, and grants available across Africa.</p>
            {/* Add functionality to display filtered opportunities here */}
        </div>
    );
};

export default Opportunities;