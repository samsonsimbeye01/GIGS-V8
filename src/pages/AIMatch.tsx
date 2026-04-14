import React from 'react';
import { Profile } from '../components/Profile';
import { MatchingEngine } from '../components/MatchingEngine';
import { GigList } from '../components/GigList';

const AIMatch = () => {
  return (
    <div>
      <h1>AI Match</h1>
      <Profile />
      <MatchingEngine explanation='This AI matching engine scores gigs based on user preferences and historical data.' />
      <GigList />
    </div>
  );
};

export default AIMatch;