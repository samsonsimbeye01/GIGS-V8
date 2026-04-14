import React from 'react';
import './Topbar.css'; // Assuming you have some styles for the Topbar

const Topbar = () => {
    return (
        <div className="topbar">
            <h1>Title</h1>
            <div className="live-indicator">Live</div>
            <div className="search-container">
                <input type="text" placeholder="Search..." />
            </div>
            <button className="post-gig-button">Post Gig</button>
        </div>
    );
};

export default Topbar;