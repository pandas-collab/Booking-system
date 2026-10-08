import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PackageItinerary.css';

const PackageItinerary = ({ itinerary = [], packageTitle = '' }) => {
  const [expandedDays, setExpandedDays] = useState(new Set([0]));

  const toggleDay = (dayIndex) => {
    const newExpandedDays = new Set(expandedDays);
    if (expandedDays.has(dayIndex)) {
      newExpandedDays.delete(dayIndex);
    } else {
      newExpandedDays.add(dayIndex);
    }
    setExpandedDays(newExpandedDays);
  };

  const expandAll = () => {
    setExpandedDays(new Set(itinerary.map((_, index) => index)));
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderActivity = (activity, index) => (
    <div key={index} className="itinerary-activity">
      <div className="activity-header">
        {activity.time && (
          <div className="activity-time">
            <i className="icon-clock"></i>
            {formatTime(activity.time)}
          </div>
        )}
        <div className="activity-title">{activity.title}</div>
      </div>
      {activity.description && (
        <div className="activity-description">{activity.description}</div>
      )}
      {activity.location && (
        <div className="activity-location">
          <i className="icon-location"></i>
          {activity.location}
        </div>
      )}
      {activity.duration && (
        <div className="activity-duration">
          <i className="icon-time"></i>
          Duration: {activity.duration}
        </div>
      )}
      {activity.included && activity.included.length > 0 && (
        <div className="activity-included">
          <strong>Included:</strong>
          <ul>
            {activity.included.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderAccommodation = (accommodation) => {
    if (!accommodation) return null;

    return (
      <div className="itinerary-accommodation">
        <div className="accommodation-header">
          <i className="icon-hotel"></i>
          <div className="accommodation-info">
            <h4>{accommodation.name}</h4>
            {accommodation.category && (
              <div className="accommodation-category">
                {Array.from({ length: accommodation.category }, (_, i) => (
                  <i key={i} className="icon-star"></i>
                ))}
              </div>
            )}
          </div>
        </div>
        {accommodation.roomType && (
          <div className="accommodation-room">
            <strong>Room Type:</strong> {accommodation.roomType}
          </div>
        )}
        {accommodation.address && (
          <div className="accommodation-address">
            <i className="icon-location"></i>
            {accommodation.address}
          </div>
        )}
        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="accommodation-amenities">
            <strong>Amenities:</strong>
            <div className="amenities-list">
              {accommodation.amenities.map((amenity, i) => (
                <span key={i} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        )}
        {accommodation.checkIn && (
          <div className="accommodation-checkin">
            <strong>Check-in:</strong> {formatTime(accommodation.checkIn)}
          </div>
        )}
        {accommodation.checkOut && (
          <div className="accommodation-checkout">
            <strong>Check-out:</strong> {formatTime(accommodation.checkOut)}
          </div>
        )}
      </div>
    );
  };

  const renderMeals = (meals) => {
    if (!meals || Object.keys(meals).length === 0) return null;

    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const mealIcons = {
      breakfast: 'icon-breakfast',
      lunch: 'icon-lunch',
      dinner: 'icon-dinner'
    };

    return (
      <div className="itinerary-meals">
        <h4>
          <i className="icon-utensils"></i>
          Meals
        </h4>
        <div className="meals-grid">
          {mealTypes.map(mealType => {
            const meal = meals[mealType];
            if (!meal) return null;

            return (
              <div key={mealType} className="meal-item">
                <div className="meal-header">
                  <i className={mealIcons[mealType]}></i>
                  <span className="meal-type">
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </span>
                </div>
                {typeof meal === 'string' ? (
                  <div className="meal-venue">{meal}</div>
                ) : (
                  <div className="meal-details">
                    {meal.venue && (
                      <div className="meal-venue">{meal.venue}</div>
                    )}
                    {meal.cuisine && (
                      <div className="meal-cuisine">Cuisine: {meal.cuisine}</div>
                    )}
                    {meal.time && (
                      <div className="meal-time">Time: {formatTime(meal.time)}</div>
                    )}
                    {meal.included === false && (
                      <div className="meal-not-included">(Not Included)</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTransportation = (transportation) => {
    if (!transportation) return null;

    return (
      <div className="itinerary-transportation">
        <h4>
          <i className="icon-transport"></i>
          Transportation
        </h4>
        {Array.isArray(transportation) ? (
          transportation.map((transport, index) => (
            <div key={index} className="transport-item">
              <div className="transport-type">
                <i className={`icon-${transport.type || 'vehicle'}`}></i>
                {transport.type || 'Transport'}
              </div>
              {transport.description && (
                <div className="transport-description">{transport.description}</div>
              )}
              {transport.departure && (
                <div className="transport-time">
                  Departure: {formatTime(transport.departure)}
                </div>
              )}
              {transport.arrival && (
                <div className="transport-time">
                  Arrival: {formatTime(transport.arrival)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="transport-item">
            <div className="transport-description">{transportation}</div>
          </div>
        )}
      </div>
    );
  };

  const renderDay = (day, dayIndex) => {
    const isExpanded = expandedDays.has(dayIndex);
    const dayNumber = dayIndex + 1;

    return (
      <div key={dayIndex} className={`itinerary-day ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="day-header" onClick={() => toggleDay(dayIndex)}>
          <div className="day-number">
            <span>Day {dayNumber}</span>
          </div>
          <div className="day-title-section">
            <h3 className="day-title">{day.title || `Day ${dayNumber}`}</h3>
            {day.location && (
              <div className="day-location">
                <i className="icon-location"></i>
                {day.location}
              </div>
            )}
          </div>
          <div className="day-toggle">
            <i className={`icon-chevron ${isExpanded ? 'up' : 'down'}`}></i>
          </div>
        </div>

        {isExpanded && (
          <div className="day-content">
            {day.overview && (
              <div className="day-overview">
                <p>{day.overview}</p>
              </div>
            )}

            {day.activities && day.activities.length > 0 && (
              <div className="day-section activities-section">
                <h4>
                  <i className="icon-calendar"></i>
                  Activities
                </h4>
                <div className="activities-timeline">
                  {day.activities.map((activity, index) => renderActivity(activity, index))}
                </div>
              </div>
            )}

            {renderMeals(day.meals)}
            
            {renderAccommodation(day.accommodation)}
            
            {renderTransportation(day.transportation)}

            {day.notes && (
              <div className="day-section notes-section">
                <h4>
                  <i className="icon-note"></i>
                  Notes
                </h4>
                <div className="day-notes">
                  {Array.isArray(day.notes) ? (
                    <ul>
                      {day.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{day.notes}</p>
                  )}
                </div>
              </div>
            )}

            {day.optionalActivities && day.optionalActivities.length > 0 && (
              <div className="day-section optional-section">
                <h4>
                  <i className="icon-optional"></i>
                  Optional Activities
                </h4>
                <div className="optional-activities">
                  {day.optionalActivities.map((activity, index) => (
                    <div key={index} className="optional-activity">
                      <div className="optional-activity-header">
                        <span className="activity-title">{activity.title}</span>
                        {activity.price && (
                          <span className="activity-price">{activity.price}</span>
                        )}
                      </div>
                      {activity.description && (
                        <div className="activity-description">{activity.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="package-itinerary empty">
        <div className="empty-state">
          <i className="icon-calendar-empty"></i>
          <h3>No Itinerary Available</h3>
          <p>Itinerary details will be provided soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="package-itinerary">
      <div className="itinerary-header">
        <div className="itinerary-title">
          <h2>
            <i className="icon-itinerary"></i>
            {packageTitle ? `${packageTitle} - Itinerary` : 'Detailed Itinerary'}
          </h2>
          <div className="itinerary-summary">
            <span className="total-days">{itinerary.length} Days</span>
          </div>
        </div>
        
        <div className="itinerary-controls">
          <button 
            className="btn btn-outline expand-all"
            onClick={expandAll}
            disabled={expandedDays.size === itinerary.length}
          >
            <i className="icon-expand"></i>
            Expand All
          </button>
          <button 
            className="btn btn-outline collapse-all"
            onClick={collapseAll}
            disabled={expandedDays.size === 0}
          >
            <i className="icon-collapse"></i>
            Collapse All
          </button>
        </div>
      </div>

      <div className="itinerary-timeline">
        {itinerary.map((day, index) => renderDay(day, index))}
      </div>

      <div className="itinerary-footer">
        <div className="itinerary-legend">
          <h4>Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <i className="icon-clock"></i>
              <span>Scheduled Time</span>
            </div>
            <div className="legend-item">
              <i className="icon-location"></i>
              <span>Location</span>
            </div>
            <div className="legend-item">
              <i className="icon-hotel"></i>
              <span>Accommodation</span>
            </div>
            <div className="legend-item">
              <i className="icon-utensils"></i>
              <span>Meals Included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PackageItinerary.propTypes = {
  itinerary: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      location: PropTypes.string,
      overview: PropTypes.string,
      activities: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string,
          time: PropTypes.string,
          location: PropTypes.string,
          duration: PropTypes.string,
          included: PropTypes.arrayOf(PropTypes.string)
        })
      ),
      accommodation: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.number,
        roomType: PropTypes.string,
        address: PropTypes.string,
        amenities: PropTypes.arrayOf(PropTypes.string),
        checkIn: PropTypes.string,
        checkOut: PropTypes.string
      }),
      meals: PropTypes.shape({
        breakfast: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        lunch: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        dinner: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      }),
      transportation: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.object)
      ]),
      notes: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
      optionalActivities: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string,
          price: PropTypes.string
        })
      )
    })
  ),
  packageTitle: PropTypes.string
};

export default PackageItinerary;