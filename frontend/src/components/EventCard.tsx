import { getInitials } from '../utils';

type Event = {
  contact: string;
  eventDate: string;
  eventDescription: string;
};

type EventCardProps = {
  date: string;
  events: Event[];
  onClick: () => void;
};
function EventCard({ date, events, onClick }: EventCardProps) {

  const getEventList = () => {
    const eventList: string[] = [];
    events.forEach((event) => {
      const normalizedDescription = event.eventDescription.toLowerCase();
      if (!eventList.includes(normalizedDescription)) {
        eventList.push(normalizedDescription);
      }
    });

    const eventListWithNames: string[] = [];
    eventList.forEach((eventDesc) => {
      const initialsList: string[] = [];
      events.forEach((event) => {
        if (event.eventDescription.toLowerCase() === eventDesc) {
          const initials = getInitials(event.contact);
          initialsList.push(initials);
        }
      });
      let allInitials;
      if (initialsList.length > 3) {
        allInitials = `${initialsList.slice(0, 3).join(',')}...`;
      } else {
        allInitials = initialsList.join(',');
      }
      const eventWithNames = `${allInitials} ${eventDesc}`;
      eventListWithNames.push(eventWithNames);
    });

    return eventListWithNames;
  };

  return (
    <div
      className='card bg-base-100 h-auto shadow-md shadow-stone-950 hover:bg-base-200 hover:transition-all hover:ease-linear m-2'
      onClick={onClick}
    >
      <div className='card-body flex flex-col justify-between h-full p-4'>
        <div className='flex items-center justify-between overflow-hidden'>
          <div className='flex items-center overflow-hidden'>
            <div className='avatar placeholder flex-shrink-0'>
              <div className='bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center'>
                <span className='text-base'>📅</span>
              </div>
            </div>
            <div className='flex flex-col items-start ml-4 overflow-x-hidden'>
              <span className='truncate text-lg font-semibold'>{date}</span>
              {getEventList().map((text) => (
                <span className='truncate text-sm'>{text}</span>
              ))}
            </div>
          </div>
          <div className='badge badge-primary text-lg flex-shrink-0'>
            {events.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
