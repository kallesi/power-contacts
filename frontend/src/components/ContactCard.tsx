import { getInitials } from '../utils';

type ContactCardProps = {
  name: string;
  tags: string[];
  onClick: () => void;
};

type ContactCardSimpleProps = {
  name: string;
  onClick: () => void;
};


function ContactCard({ name, tags, onClick }: ContactCardProps) {
  const initials = getInitials(name);

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
          <span className='ml-4 truncate flex-grow'>{name}</span>
        </div>
        <div className='flex flex-wrap mt-2'>
          {tags.map((tag) => (
            <div
              key={crypto.randomUUID()}
              className='badge badge-primary m-1 p-2 font-medium text-sm'
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactCardSimple({ name, onClick }: ContactCardSimpleProps) {
  const initials = getInitials(name);

  return (
    <div
      className='card bg-base-100 h-20 shadow-lg shadow-stone-950 hover:bg-base-200 hover:transition-all hover:ease-linear m-2'
      onClick={onClick}
    >
      <div className='card-body flex flex-col justify-between h-full p-4'>
        <div className='flex items-center overflow-hidden'>
          <div className='avatar placeholder flex-shrink-0'>
            <div className='bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center'>
              <span className='text-base'>{initials}</span>
            </div>
          </div>
          <span className='ml-4 truncate flex-grow'>{name}</span>
        </div>
      </div>
    </div>
  );
}

export { ContactCard, ContactCardSimple };
