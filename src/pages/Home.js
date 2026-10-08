import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Travel App</h1>
      <nav>
        <Link to="/destinations">Destinations</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/search">Search</Link>
      </nav>
    </div>
  );
};

export default Home;
