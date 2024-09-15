import { getInitials } from '../utils';

type ContactCardProps = {
  name: string;
  tags: string[];
  onClick: () => void;
};

function ContactCard({ name, tags, onClick }: ContactCardProps) {
  const initials = getInitials(name);

  return (
    <div
      className='card bg-base-100 m-2 p-2 shadow-lg shadow-stone-950 hover:bg-base-200 hover:transition-all hover:ease-linear'
      onClick={onClick}
    >
      <div className='card-body flex flex-col justify-between h-full'>
        <div className='flex items-center overflow-hidden'>
          <div className='avatar placeholder flex-shrink-0'>
            <div className='bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center'>
              <span className='text-base'>{initials}</span>
            </div>
          </div>
          <span className='ml-2 truncate'>{name}</span>
        </div>
        <div className='flex flex-row flex-wrap justify-center items-center mt-2'>
          {tags.map((tag) => (
            <div key={tag} className='badge badge-primary m-1 p-2 font-medium'>
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactCard;