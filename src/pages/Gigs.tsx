import React from 'react';

const Gigs = () => {
  const [gigs, setGigs] = React.useState([]); // State for storing user gigs

  // Fetch active gigs from backend or define static gigs for demonstration
  React.useEffect(() => {
    // Placeholder for fetching the user's active gigs
    const fetchedGigs = [
      {
        id: 1,
        title: 'Gig 1',
        status: 'In Progress',
        steps: ['Initiated', 'In Review', 'Completed'],
      },
      {
        id: 2,
        title: 'Gig 2',
        status: 'Pending',
        steps: ['Initiated'],
      },
      // ...more gigs
    ];
    setGigs(fetchedGigs);
  }, []);

  return (
    <div>
      <h1>Your Active Gigs</h1>
      {gigs.length === 0 ? (
        <p>No active gigs at the moment.</p>
      ) : (
        gigs.map((gig) => (
          <div key={gig.id} className="gig">
            <h2>{gig.title}</h2>
            <p>Status: {gig.status}</p>
            <div className="steps">
              <h3>Lifecycle Tracker:</h3>
              <ul>
                {gig.steps.map((step, index) => (
                  <li key={index} className={index === gig.steps.length - 1 ? 'current-step' : ''}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Gigs;