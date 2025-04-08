import React from 'react';
import './EditForm.css'; // Import EditForm-specific styles

const EditForm = ({ editingEvent, setEditingEvent, handleUpdate, eventId }) => {
  return (
    <div className="edit-form">
      <h2>Edit Event</h2>
      <label>Title:</label>
      <input
        type="text"
        value={editingEvent.title}
        onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
      />
      <label>Venue:</label>
      <input
        type="text"
        value={editingEvent.venue_name}
        onChange={e => setEditingEvent({ ...editingEvent, venue_name: e.target.value })}
      />
      <label>Location:</label>
      <input
        type="text"
        value={editingEvent.location}
        onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
      />
      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={editingEvent.start_time}
        onChange={e => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
      />
      <label>End Time:</label>
      <input
        type="datetime-local"
        value={editingEvent.end_time}
        onChange={e => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
      />
      <label>Timezone:</label>
      <input
        type="text"
        value={editingEvent.timezone}
        onChange={e => setEditingEvent({ ...editingEvent, timezone: e.target.value })}
      />
      <label>Description:</label>
      <textarea
        value={editingEvent.description}
        onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
      />
      <div className="edit-buttons">
        <button onClick={() => handleUpdate(eventId)}>Save</button>
        <button onClick={() => setEditingEvent(null)}>Cancel</button>
      </div>
    </div>
  );
};

export default EditForm;