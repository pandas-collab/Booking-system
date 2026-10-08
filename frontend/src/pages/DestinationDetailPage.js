import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DestinationDetail from '../components/destinations/DestinationDetail';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/destinations/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Destination not found');
          }
          throw new Error('Failed to fetch destination details');
        }
        
        const data = await response.json();
        setDestination(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate('/destinations');
  };

  if (loading) {
    return (
      <div className="destination-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading destination details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destination-detail-page">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <Link to="/destinations">Destinations</Link>
            <span className="separator">/</span>
            <span className="current">Error</span>
          </nav>
          
          <div className="error-container">
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={handleBackClick}
                className="btn btn-secondary"
              >
                Back to Destinations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="destination-detail-page">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <Link to="/destinations">Destinations</Link>
            <span className="separator">/</span>
            <span className="current">Not Found</span>
          </nav>
          
          <div className="not-found-container">
            <h1>Destination Not Found</h1>
            <p>The destination you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={handleBackClick}
              className="btn btn-primary"
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/destinations">Destinations</Link>
          <span className="separator">/</span>
          <span className="current">{destination.name}</span>
        </nav>

        <div className="page-header">
          <button 
            onClick={handleBackClick}
            className="back-button"
            aria-label="Back to destinations"
          >
            ← Back to Destinations
          </button>
        </div>

        <DestinationDetail 
          destination={destination}
          onUpdate={setDestination}
        />
      </div>
    </div>
  );
};

export default DestinationDetailPage;