import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HappeningNowColumn from './HappeningNowColumn';
import TimelineColumn from './TimelineColumn';
import './App.css'; // App-specific styles
import './EventSections.css'; // Event sections styles

function EventTimeline({ searchTerm, setSearchTerm, sortOption, setSortOption, user }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      events.forEach(event => {
        const startTime = new Date(event.start_time);
        const now = new Date();
        const diff = startTime - now;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[event.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          newTimeLeft[event.id] = '00:00:00';
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const fetchEvents = () => {
    axios.get('http://192.168.64.3:3000/api/events')
      .then(response => {
        setEvents(response.data);
        setFilteredEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events: ' + error.message);
      });
  };

  useEffect(() => {
    let updatedEvents = [...events].filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === 'date') {
      updatedEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    } else if (sortOption === 'name') {
      updatedEvents.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredEvents(updatedEvents);
  }, [searchTerm, sortOption, events]);

  const getProgress = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    const total = endTime - startTime;
    const elapsed = now - startTime;

    if (now < startTime) {
      const timeToStart = startTime - now;
      if (timeToStart <= 15 * 60 * 1000) return { progress: 0, color: '#bb86fc', status: 'soon' };
      if (timeToStart <= 60 * 60 * 1000) return { progress: 0, color: '#03dac6', status: 'upcoming' };
      return { progress: 0, color: '#4b5e7a', status: 'future' };
    }
    if (now > endTime) return { progress: 100, color: '#ef5350', status: 'ended' };

    const progress = (elapsed / total) * 100;
    if (progress >= 70) return { progress, color: '#ff8a65', status: 'ending', flash: true };
    if (progress >= 30) return { progress, color: '#81c784', status: 'ongoing' };
    return { progress, color: '#66bb6a', status: 'started' };
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleEdit = (event) => {
    setEditingEvent({ 
      ...event,
      start_time: formatDateForInput(event.start_time),
      end_time: formatDateForInput(event.end_time)
    });
  };

  const handleUpdate = (id) => {
    const payload = {
      ...editingEvent,
      start_time: new Date(editingEvent.start_time).toISOString(),
      end_time: new Date(editingEvent.end_time).toISOString()
    };
    
    axios.put(`http://192.168.64.3:3000/api/events/${id}`, payload)
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

  const toggleExpand = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getDay = (date) => {
    return new Date(date).toLocaleDateString('en-US', { day: '2-digit' });
  };

  const getMonth = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime = new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${startTime} - ${endTime}`;
  };

  const getNextEventTime = () => {
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.start_time) > now);
    if (upcomingEvents.length === 0) return '00:00:00';
    const nextEvent = upcomingEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];
    const diff = new Date(nextEvent.start_time) - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const now = new Date();
  const happeningNow = filteredEvents.filter(event => {
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    return startTime <= now && now <= endTime;
  });

  const comingUp = filteredEvents.filter(event => {
    const startTime = new Date(event.start_time);
    return startTime > now;
  }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  return (
    <div className="App">
      <img src="/top_banner.png" alt="VibeX Banner" className="event-banner" />
      <div className="event-sections">
        <div className="event-columns">
          <HappeningNowColumn
            events={happeningNow}
            editingEvent={editingEvent}
            setEditingEvent={setEditingEvent}
            expandedEvent={expandedEvent}
            toggleExpand={toggleExpand}
            handleEdit={handleEdit}
            handleUpdate={handleUpdate}
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
          <TimelineColumn
            events={comingUp}
            editingEvent={editingEvent}
            setEditingEvent={setEditingEvent}
            expandedEvent={expandedEvent}
            toggleExpand={toggleExpand}
            handleEdit={handleEdit}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            getProgress={getProgress}
            timeLeft={timeLeft}
            getDayOfWeek={getDayOfWeek}
            getDay={getDay}
            getMonth={getMonth}
            getFormattedDate={getFormattedDate}
            getTimeRange={getTimeRange}
            getNextEventTime={getNextEventTime}
            currentMonth={currentMonth}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}

export default EventTimeline;