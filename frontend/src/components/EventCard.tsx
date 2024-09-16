type Event = {
  contact: string;
  eventDate: string;
  eventDescription: string;
};

type EventCardProps = {
  date: string;
  firstEventName: string;
  events: Event[];
  onClick: () => void;
};
function EventCard({ date, firstEventName, events, onClick }: EventCardProps) {
  return (
    <div
      className='card bg-base-100 h-20 shadow-lg shadow-stone-950 hover:bg-base-200 hover:transition-all hover:ease-linear m-2'
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
            <div className='flex flex-col items-start ml-4 overflow-hidden'>
              <span className='truncate text-lg font-semibold'>{date}</span>
              <span className='truncate'>{firstEventName}</span>
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
