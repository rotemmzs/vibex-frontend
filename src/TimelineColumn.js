import React from 'react';
import EventTile from './EventTile';
import EditForm from './EditForm';
import './TimelineColumn.css'; // Import TimelineColumn-specific styles

const TimelineColumn = ({
  events,
  editingEvent,
  setEditingEvent,
  expandedEvent,
  toggleExpand,
  handleEdit,
  handleUpdate,
  handleDelete,
  getProgress,
  timeLeft,
  getDayOfWeek,
  getDay,
  getMonth,
  getFormattedDate,
  getTimeRange,
  getNextEventTime,
  currentMonth,
  handlePrevMonth,
  handleNextMonth,
  user
}) => {
  return (
    <div className="timeline-column">
      <div className="section-header">
        <h1 className="section-title">
          Coming Up Next in <span className="time-oval">{getNextEventTime()}</span>
        </h1>
      </div>
      <div className="date-navigation">
        <button onClick={handlePrevMonth} className="nav-arrow">←</button>
        <span className="current-month">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
        </span>
        <button onClick={handleNextMonth} className="nav-arrow">→</button>
      </div>
      <div className="event-list">
        {events.length > 0 ? (
          events.map((event, index) => {
            if (editingEvent && editingEvent.id === event.id) {
              return (
                <EditForm
                  key={event.id}
                  editingEvent={editingEvent}
                  setEditingEvent={setEditingEvent}
                  handleUpdate={handleUpdate}
                  eventId={event.id}
                />
              );
            }
            return (
              <EventTile
                key={event.id}
                event={event}
                index={index + events.length}
                isLargeTile={false}
                expandedEvent={expandedEvent}
                toggleExpand={toggleExpand}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getProgress={getProgress}
                timeLeft={timeLeft}
                getDayOfWeek={getDayOfWeek}
                getDay={getDay}
                getMonth={getMonth}
                getFormattedDate={getFormattedDate}
                getTimeRange={getTimeRange}
                user={user}
              />
            );
          })
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default TimelineColumn;