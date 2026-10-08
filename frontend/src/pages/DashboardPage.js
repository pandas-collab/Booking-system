import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/common/Header.js";
import { useAuth } from "../context/AuthContext.js";
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kpiData, setKpiData] = useState({
    activeBookings: 3,
    destinationsVisited: 7,
    upcomingTrips: 2,
    rewardPoints: 1240
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock recent bookings
      setRecentBookings([
        {
          id: 1,
          destination: 'Paris, France',
          status: 'Confirmed',
          departureDate: '2024-02-15',
          bookingAmount: 1299
        },
        {
          id: 2,
          destination: 'Tokyo, Japan',
          status: 'Pending',
          departureDate: '2024-03-20',
          bookingAmount: 1899
        },
        {
          id: 3,
          destination: 'New York, USA',
          status: 'Confirmed',
          departureDate: '2024-04-10',
          bookingAmount: 899
        },
        {
          id: 4,
          destination: 'Rome, Italy',
          status: 'Cancelled',
          departureDate: '2024-05-05',
          bookingAmount: 1499
        },
        {
          id: 5,
          destination: 'London, UK',
          status: 'Confirmed',
          departureDate: '2024-06-12',
          bookingAmount: 1199
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKPIClick = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleBookingRowClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  // Navigation handlers for Quick Actions
  const handleBookNewTrip = () => {
    navigate("/destinations");
  };
  };

  const handleBrowsePackages = () => {
    navigate('/packages');
  };

  const handleManageProfile = () => {
    navigate('/profile');
  };
    navigate('/destinations');
  };

  const handleViewAllBookings = () => {
    navigate('/bookings');
  };

  const handleBrowsePackages = () => {
    navigate('/packages');
  };

  const handleManageProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Header />
        <div className="dashboard-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1>Welcome back, {user?.name || 'User'}!</h1>
        </div>

        <div className="dashboard-content">
          <div className="main-content">
            {/* KPI Grid */}
            <div className="kpi-grid">
              <div className="kpi-card" onClick={() => handleKPIClick('activeBookings')}>
                <div className="kpi-icon"></div>
                <div className="kpi-content">
                  <h3>{kpiData.activeBookings}</h3>
                  <p>Active Bookings</p>
                </div>
              </div>

              <div className="kpi-card" onClick={() => handleKPIClick('destinationsVisited')}>
                <div className="kpi-icon"></div>
                <div className="kpi-content">
                  <h3>{kpiData.destinationsVisited}</h3>
                  <p>Destinations Visited</p>
                </div>
              </div>

              <div className="kpi-card" onClick={() => handleKPIClick('upcomingTrips')}>
                <div className="kpi-icon"></div>
                <div className="kpi-content">
                  <h3>{kpiData.upcomingTrips}</h3>
                  <p>Upcoming Trips</p>
                </div>
              </div>

              <div className="kpi-card" onClick={() => handleKPIClick('rewardPoints')}>
                <div className="kpi-icon"></div>
                <div className="kpi-content">
                  <h3>{kpiData.rewardPoints.toLocaleString()}</h3>
                  <p>Reward Points</p>
                </div>
              </div>
            </div>

            {/* Recent Bookings Section */}
            <div className="recent-bookings-section">
              <h2>Recent Bookings</h2>
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Departure Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="booking-row"
                        onClick={() => handleBookingRowClick(booking.id)}
                      >
                        <td>#{booking.id.toString().padStart(4, '0')}</td>
                        <td>{booking.destination}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>{new Date(booking.departureDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="quick-actions-widget">
            <h2>Quick Actions</h2>
            <div className="quick-actions-buttons">
              <button
                className="action-button primary"
                onClick={handleBookNewTrip}
              >
                <span className="action-icon"></span>
                Book New Trip
              </button>

              <button
                className="action-button secondary"
                onClick={handleViewAllBookings}
              >
                <span className="action-icon"></span>
                View All Bookings
              </button>

              <button
                className="action-button secondary"
                onClick={handleBrowsePackages}
              >
                <span className="action-icon"></span>
                Browse Packages
              </button>

              <button
                className="action-button secondary"
                onClick={handleManageProfile}
              >
                <span className="action-icon"></span>
                Manage Profile
              </button>
            </div>
          </div>
        </div>

        {/* KPI Detail Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                <button className="close-button" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Detailed information about {modalType} would be displayed here.</p>
                <p>Current value: {kpiData[modalType]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
