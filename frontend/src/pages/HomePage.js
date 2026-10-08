import Header from "../components/common/Header.js";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredDestinations = [
    {
      id: 1,
      name: 'Paris, France',
      image: '/images/paris.jpg',
      description: 'City of Light and romance',
      price: 'From $299'
    },
    {
      id: 2,
      name: 'Tokyo, Japan',
      image: '/images/tokyo.jpg',
      description: 'Modern metropolis meets tradition',
      price: 'From $599'
    },
    {
      id: 3,
      name: 'New York, USA',
      image: '/images/newyork.jpg',
      description: 'The city that never sleeps',
      price: 'From $199'
    },
    {
      id: 4,
      name: 'Bali, Indonesia',
      image: '/images/bali.jpg',
      description: 'Tropical paradise awaits',
      price: 'From $399'
    },
    {
      id: 5,
      name: 'London, England',
      image: '/images/london.jpg',
      description: 'Historic charm and modern culture',
      price: 'From $249'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [featuredDestinations.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredDestinations.length) % featuredDestinations.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Next Adventure</h1>
            <p className="hero-subtitle">
              Explore amazing destinations around the world with our curated travel experiences
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-background">
          <div className="hero-image"></div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">
              Handpicked destinations for your perfect getaway
            </p>
          </div>

          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
              >
                {featuredDestinations.map((destination, index) => (
                  <div key={destination.id} className="carousel-slide">
                    <div className="destination-card">
                      <div className="destination-image">
                        <img 
                          src={destination.image} 
                          alt={destination.name}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <div className="destination-overlay">
                          <span className="destination-price">{destination.price}</span>
                        </div>
                      </div>
                      <div className="destination-info">
                        <h3 className="destination-name">{destination.name}</h3>
                        <p className="destination-description">{destination.description}</p>
                        <Link to="/register" className="destination-btn">
                          Explore Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="carousel-indicators">
              {featuredDestinations.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Curated Destinations</h3>
              <p className="feature-description">
                Hand-picked locations from travel experts around the globe
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">
                Competitive prices with exclusive deals and discounts
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V16.92" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 9H22V16H2V9Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 4H18V9H6V4Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Round-the-clock customer support for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of travelers who have discovered amazing destinations with us
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/destinations" className="btn btn-outline btn-large">
                Browse Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;