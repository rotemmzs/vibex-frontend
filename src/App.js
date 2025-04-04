import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://192.168.64.3:3000/api/events')
      .then(response => {
        setEvents(response.data);
        console.log('Events fetched:', response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events: ' + error.message);
      });
  }, []);

  const getProgress = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    const total = endTime - startTime;
    const elapsed = now - startTime;

    if (now < startTime) {
      const timeToStart = startTime - now;
      if (timeToStart <= 15 * 60 * 1000) return { progress: 0, color: 'yellow', status: 'soon' }; // 15 min before
      if (timeToStart <= 60 * 60 * 1000) return { progress: 0, color: 'blue', status: 'upcoming' }; // 60 min before
      return { progress: 0, color: 'gray', status: 'future' };
    }
    if (now > endTime) return { progress: 100, color: 'red', status: 'ended' };

    const progress = (elapsed / total) * 100;
    if (progress >= 70) return { progress, color: 'orange', status: 'ending', flash: true }; // 30% before end
    if (progress >= 30) return { progress, color: 'lightgreen', status: 'ongoing' }; // 30% into
    return { progress, color: 'green', status: 'started' };
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
