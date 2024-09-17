import { useEffect } from 'react';
import EventPageCard from './EventPageCard';
import { useNavigate } from 'react-router-dom';

type Event = {
  contact: string;
  contactId: string;
  eventDate: string;
  eventDescription: string;
};

type EventPageProps = {
  date: string;
  events: Event[];
  onClose: () => void;
};

function EventPage({ date, events, onClose }: EventPageProps) {
  const navigate = useNavigate();

  const redirect = (contactId: string) => {
    navigate(`/app/contact/${contactId}`);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20'
      onClick={onClose}
    >
      <div
        className='mt-8 p-5 card bg-base-100 shadow-lg z-30 w-3/5 h-5/6 overflow-auto shadow-black'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{date}</h2>
        </div>
        <div className='grid grid-cols-3'>
          {events.map((event) => (
            <div key={event.contactId}>
              <EventPageCard
                contactName={event.contact}
                description={event.eventDescription}
                onClick={() => redirect(event.contactId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventPage;