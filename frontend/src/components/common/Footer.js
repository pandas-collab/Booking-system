import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>Company</h3>
            </div>
            <p className="footer-description">
              Building innovative solutions for the digital world. 
              Connect with us to learn more about our services.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="social-link">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><a href="/web-development">Web Development</a></li>
              <li><a href="/mobile-apps">Mobile Apps</a></li>
              <li><a href="/consulting">Consulting</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>
                <i className="fas fa-envelope"></i>
                <span>contact@company.com</span>
              </p>
              <p>
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Business St, City, State 12345</span>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Company Name. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/sitemap">Sitemap</a>
              <span className="separator">|</span>
              <a href="/accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;