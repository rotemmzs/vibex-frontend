import React from 'react';
import EventTile from './EventTile';
import EditForm from './EditForm';
import './HappeningNowColumn.css'; // Import HappeningNowColumn-specific styles

const HappeningNowColumn = ({
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
  user
}) => {
  return (
    <div className="happening-now-column">
      <div className="section-header">
        <h1 className="section-title">Events Happening Now</h1>
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
                index={index}
                isLargeTile={true}
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
          <p>No events happening now.</p>
        )}
      </div>
    </div>
  );
};

export default HappeningNowColumn;