import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.64.3:3000/api/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>VibeX Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} - {event.venue_name} ({event.location})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
