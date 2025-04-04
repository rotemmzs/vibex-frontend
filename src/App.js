import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('http://192.168.64.3:3000/api/events')
      .then(response => {
        setEvents(response.data);
        console.log('Events fetched:', response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events: ' + error.message);
      });
  };

  const getProgress = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    const total = endTime - startTime;
    const elapsed = now - startTime;

    if (now < startTime) {
      const timeToStart = startTime - now;
      if (timeToStart <= 15 * 60 * 1000) return { progress: 0, color: 'yellow', status: 'soon' };
      if (timeToStart <= 60 * 60 * 1000) return { progress: 0, color: 'blue', status: 'upcoming' };
      return { progress: 0, color: 'gray', status: 'future' };
    }
    if (now > endTime) return { progress: 100, color: 'red', status: 'ended' };

    const progress = (elapsed / total) * 100;
    if (progress >= 70) return { progress, color: 'orange', status: 'ending', flash: true };
    if (progress >= 30) return { progress, color: 'lightgreen', status: 'ongoing' };
    return { progress, color: 'green', status: 'started' };
  };

  const handleEdit = (event) => {
    setEditingEvent({ ...event });
  };

  const handleUpdate = (id) => {
    axios.put(`http://192.168.64.3:3000/api/events/${id}`, editingEvent)
      .then(response => {
        setEvents(events.map(e => e.id === id ? response.data : e));
        setEditingEvent(null);
      })
      .catch(error => {
        console.error('Error updating event:', error);
        setError('Failed to update event: ' + error.message);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://192.168.64.3:3000/api/events/${id}`)
      .then(() => {
        setEvents(events.filter(e => e.id !== id));
      })
      .catch(error => {
        console.error('Error deleting event:', error);
        setError('Failed to delete event: ' + error.message);
      });
  };

  return (
    <div className="App">
      <h1>VibeX Events</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="event-list">
        {events.map(event => {
          const { progress, color, status, flash } = getProgress(event.start_time, event.end_time);
          return (
            <div key={event.id} className={`event-tile ${flash ? 'flash' : ''}`}>
              {editingEvent && editingEvent.id === event.id ? (
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
                    value={editingEvent.start_time.slice(0, 16)}
                    onChange={e => setEditingEvent({ ...editingEvent, start_time: e.target.value + 'Z' })}
                  />
                  <label>End Time:</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.end_time.slice(0, 16)}
                    onChange={e => setEditingEvent({ ...editingEvent, end_time: e.target.value + 'Z' })}
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
                    <button onClick={() => handleUpdate(event.id)}>Save</button>
                    <button onClick={() => setEditingEvent(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>{event.title}</h2>
                  <p><strong>Venue:</strong> {event.venue_name}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Starts:</strong> {new Date(event.start_time).toLocaleString()}</p>
                  <p><strong>Ends:</strong> {new Date(event.end_time).toLocaleString()}</p>
                  <p><strong>Timezone:</strong> {event.timezone}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <div className="progress-bar" style={{ background: '#e0e0e0', height: '10px', width: '100%', borderRadius: '5px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: color, borderRadius: '5px' }}></div>
                  </div>
                  <p><strong>Status:</strong> {status}</p>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(event)}>Edit</button>
                    <button onClick={() => handleDelete(event.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
