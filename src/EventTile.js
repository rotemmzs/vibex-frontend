import React from 'react';
import './EventTile.css'; // Import EventTile-specific styles

const EventTile = ({
  event,
  index,
  isLargeTile,
  expandedEvent,
  toggleExpand,
  handleEdit,
  handleDelete,
  getProgress,
  timeLeft,
  getDayOfWeek,
  getDay,
  getMonth,
  getFormattedDate,
  getTimeRange,
  user
}) => {
  const { progress, color, status, flash } = getProgress(event.start_time, event.end_time);
  const isExpanded = expandedEvent === event.id;

  return (
    <div
      key={event.id}
      className={`event-tile ${isLargeTile ? 'large-tile' : 'small-tile'} ${flash ? 'flash' : ''} tile-${index % 5}`}
    >
      <div className="event-tile-content">
        <div className="event-tile-header" onClick={() => toggleExpand(event.id)}>
          <div className="event-tile-date">
            <span className="event-tile-day-of-week">{getDayOfWeek(event.start_time)}</span>
            <span className="event-tile-day">{getDay(event.start_time)}</span>
            <span className="event-tile-month">{getMonth(event.start_time)}</span>
          </div>
          <div className="event-tile-main-content">
            <h2>{event.title.toUpperCase()}</h2>
            <p className="event-tile-date-text">{getFormattedDate(event.start_time)} - {event.location}</p>
            <p className="event-tile-time">{getTimeRange(event.start_time, event.end_time)}</p>
            <p className="event-tile-venue">
              <span className="pin-icon">📍</span> {event.venue_name}
            </p>
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: color }}>
                  <div className="progress-marker"></div>
                </div>
              </div>
              <span className="progress-time-left">{timeLeft[event.id] || '00:00:00'} Time Left</span>
            </div>
          </div>
        </div>
        <div className={`event-tile-expanded ${isExpanded ? 'expanded' : ''}`}>
          <div className="event-tile-expanded-content">
            <div className="event-tile-description">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>
            <div className="event-tile-lineup">
              <h3>Lineup</h3>
              <p>{event.lineup || 'No lineup available'}</p>
            </div>
            <div className="event-tile-status">
              <h3>Status</h3>
              <p>{status}</p>
            </div>
          </div>
        </div>
        <div className="event-tile-footer">
          <button className="get-tickets-button">
            <span className="ticket-icon">🎫</span> GET TICKETS
          </button>
        </div>
        <div className="action-buttons">
          {user && user.role === 'admin' && (
            <button onClick={(e) => { e.stopPropagation(); handleEdit(event); }}>Edit</button>
          )}
          <button onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default EventTile;