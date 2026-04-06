import React, { useState } from 'react';
import './Explore.css';

const Explore = () => {
  const [category, setCategory] = useState('All');

  const gigs = [
    { id: 1, title: 'Web Development', category: 'Development' },
    { id: 2, title: 'Graphic Design', category: 'Design' },
    { id: 3, title: 'SEO Optimization', category: 'Marketing' },
    // Add more gigs as needed
  ];

  const categories = ['All', 'Development', 'Design', 'Marketing'];

  const filteredGigs = category === 'All' ? gigs : gigs.filter(gig => gig.category === category);

  return (
    <div className="explore-container">
      <h1>Explore Gigs</h1>
      <div className="category-chips">
        {categories.map(cat => (
          <button key={cat} className={`chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="gig-listings">
        {filteredGigs.map(gig => (
          <div key={gig.id} className="gig-item">
            <h2>{gig.title}</h2>
            <p>Category: {gig.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;