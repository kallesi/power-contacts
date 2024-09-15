import { getInitials } from '../utils';

type EventPageCardProps = {
  contactName: string;
  description: string;
  onClick: () => void;
};

function EventPageCard({ contactName, description, onClick }: EventPageCardProps) {
  const initials = getInitials(contactName);
  return (
    <div
      className='card bg-base-100 h-40 shadow-lg shadow-stone-950 hover:bg-base-200 hover:transition-all hover:ease-linear m-2'
      onClick={onClick}
    >
      <div className='card-body flex flex-col justify-between h-full p-4'>
        <div className='flex items-center overflow-hidden'>
          <div className='avatar placeholder flex-shrink-0'>
            <div className='bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center'>
              <span className='text-base'>{initials}</span>
            </div>
          </div>
          <span className='ml-4 truncate flex-grow'>{contactName}</span>
        </div>
        <div>
          <h2>{description}</h2>
        </div>
      </div>
    </div>
  );
}

export default EventPageCard;