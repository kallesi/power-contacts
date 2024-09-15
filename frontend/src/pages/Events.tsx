import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../constants';
import useFetch from '../hooks/useFetch';
import NavBar from '../components/NavBar';
import EventPage from '../components/EventPage';
import EventCard from '../components/EventCard';
import { isThisWeek, isThisMonth, isBefore } from 'date-fns';

type Event = {
  contact: string;
  contactId: string;
  eventDate: string;
  eventDescription: string;
};

type Events = {
  [date: string]: Event[];
};

function EventsPage() {
  const { data: events } = useFetch<Events>(`${BACKEND_URL}/events`, 'GET');
  const [localEvents, setLocalEvents] = useState<Events>({});
  const [searchText, setSearchText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<{ date: string; events: Event[] } | null>(null);

  useEffect(() => {
    setLocalEvents(events || {});
  }, [events]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setLocalEvents(events || {});
    } else {
      setLocalEvents(() => {
        const filteredEvents = Object.entries(events || {}).reduce((acc, [date, eventList]) => {
          if (date.toLowerCase().includes(searchText.toLowerCase())) {
            acc[date] = eventList;
          }
          return acc;
        }, {} as Events);
        return filteredEvents;
      });
    }
  }, [searchText, events]);

  const handleEventClick = (date: string, events: Event[]) => {
    setSelectedEvent({ date, events });
  };

  const handleCloseOverlay = () => {
    setSelectedEvent(null);
  };

  const today = new Date();

  const groupedEvents = {
    past: {} as Events,
    thisWeek: {} as Events,
    thisMonth: {} as Events,
    furtherDown: {} as Events,
  };

  Object.entries(localEvents).forEach(([date, eventList]) => {
    const eventDate = new Date(date);

    if (isBefore(eventDate, today)) {
      groupedEvents.past[date] = eventList;
    } else if (isThisWeek(eventDate)) {
      groupedEvents.thisWeek[date] = eventList;
    } else if (isThisMonth(eventDate)) {
      groupedEvents.thisMonth[date] = eventList;
    } else {
      groupedEvents.furtherDown[date] = eventList;
    }
  });

  const renderEventCards = (events: Events) => (
    Object.entries(events).map(([date, eventList]) => (
      <EventCard
        key={date}
        events={eventList}
        date={date}
        onClick={() => handleEventClick(date, eventList)}
      />
    ))
  );

  return (
    <div>
      <div className='fixed top-0 left-0 w-full z-10'>
        <NavBar
          searchText={searchText}
          setSearchText={setSearchText}
          showSearch={true}
        />
      </div>
      <div className='mt-20 p-5'>
        <h2 className='text-xl font-bold'>In the Past:</h2>
        <div className='grid grid-cols-5'>
          {renderEventCards(groupedEvents.past)}
        </div>

        <h2 className='text-xl font-bold mt-10'>This Week:</h2>
        <div className='grid grid-cols-5'>
          {renderEventCards(groupedEvents.thisWeek)}
        </div>

        <h2 className='text-xl font-bold mt-10'>This Month:</h2>
        <div className='grid grid-cols-5'>
          {renderEventCards(groupedEvents.thisMonth)}
        </div>

        <h2 className='text-xl font-bold mt-10'>Further Down:</h2>
        <div className='grid grid-cols-5'>
          {renderEventCards(groupedEvents.furtherDown)}
        </div>
      </div>
      {selectedEvent && (
        <EventPage
          date={selectedEvent.date}
          events={selectedEvent.events}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}

export default EventsPage;