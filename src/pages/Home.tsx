import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to GigApp</h1>
        <p>Connect with freelancers and manage your gigs efficiently</p>
        <div>
          {!user ? (
            <>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Features</h2>
        <div className="features-grid">
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
            <h3>Easy to Use</h3>
            <p>Our platform is intuitive and easy to navigate.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💼</div>
            <h3>Professional Tools</h3>
            <p>Access powerful tools to manage your gigs.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
            <h3>Secure & Safe</h3>
            <p>Your data is protected with industry-leading security.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
