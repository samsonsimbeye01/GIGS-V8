import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1>Dashboard</h1>
      <h2 style={{ marginBottom: '2rem' }}>Welcome, {user?.name}!</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Active Gigs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">$0</div>
          <div className="stat-label">Earnings</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <button className="btn btn-primary">Post New Gig</button>
        <button className="btn btn-secondary" style={{ marginLeft: '1rem' }}>Browse Gigs</button>
      </div>
    </div>
  );
};

export default Dashboard;
