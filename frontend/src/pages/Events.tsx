import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../constants';
import useFetch from '../hooks/useFetch';
import NavBar from '../components/NavBar';
import EventPage from '../components/EventPage';
import EventCard from '../components/EventCard';
import { isThisMonth, isBefore, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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
  const [selectedEvent, setSelectedEvent] = useState<{
    date: string;
    events: Event[];
  } | null>(null);

  useEffect(() => {
    setLocalEvents(events || {});
  }, [events]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setLocalEvents(events || {});
    } else {
      setLocalEvents(() => {
        const filteredEvents = Object.entries(events || {}).reduce(
          (acc, [date, eventList]) => {
            if (date.toLowerCase().includes(searchText.toLowerCase())) {
              acc[date] = eventList;
            }
            return acc;
          },
          {} as Events
        );
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

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = toZonedTime(new Date(), timeZone);
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });

  const groupedEvents = {
    past: {} as Events,
    thisWeek: {} as Events,
    thisMonth: {} as Events,
    furtherDown: {} as Events,
  };

  Object.entries(localEvents).forEach(([date, eventList]) => {
    const eventDate = toZonedTime(parseISO(date), timeZone);

    if (isBefore(eventDate, startOfCurrentWeek)) {
      groupedEvents.past[date] = eventList;
    } else if (eventDate >= startOfCurrentWeek && eventDate <= endOfCurrentWeek) {
      groupedEvents.thisWeek[date] = eventList;
    } else if (isThisMonth(eventDate)) {
      groupedEvents.thisMonth[date] = eventList;
    } else {
      groupedEvents.furtherDown[date] = eventList;
    }
  });

  const renderEventCards = (events: Events) =>
    Object.entries(events).map(([date, eventList]) => (
      <EventCard
        key={date}
        events={eventList}
        date={date}
        onClick={() => handleEventClick(date, eventList)}
      />
    ));

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
        <div className='collapse bg-base-200'>
          <input type='checkbox' />
          <div className='collapse-title text-xl font-medium'>In the Past:</div>
          <div className='collapse-content'>
            <div className='grid grid-cols-4'>
              {renderEventCards(groupedEvents.past)}
            </div>
          </div>
        </div>
        <h2 className='text-xl font-bold mt-10'>This Week:</h2>
        <div className='grid grid-cols-4'>
          {renderEventCards(groupedEvents.thisWeek)}
        </div>

        <h2 className='text-xl font-bold mt-10'>This Month:</h2>
        <div className='grid grid-cols-4'>
          {renderEventCards(groupedEvents.thisMonth)}
        </div>
        <div className='h-12'></div>
        <div className='collapse bg-base-200'>
          <input type='checkbox' />
          <div className='collapse-title text-xl font-medium'>Further Down:</div>
          <div className='collapse-content'>
            <div className='grid grid-cols-4'>
              {renderEventCards(groupedEvents.furtherDown)}
            </div>
          </div>
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