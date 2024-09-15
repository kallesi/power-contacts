type Person = {
  id: string;
  name: string;
};

type TagCardProps = {
  tag: string;
  people: Person[];
  onClick: () => void;
};

function TagCard({ tag, people, onClick }: TagCardProps) {
  return (
    <div
      className='card bg-base-100 h-20 shadow-lg shadow-stone-950 hover:bg-base-200 hover:transition-all hover:ease-linear m-2'
      onClick={onClick}
    >
      <div className='card-body flex flex-col justify-between h-full p-4'>
        <div className='flex items-center overflow-hidden'>
          <div className='avatar placeholder flex-shrink-0'>
            <div className='bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center'>
              <span className='text-base'>#</span>
            </div>
          </div>
          <span className='ml-4 truncate flex-grow'>{tag}</span>
          <div className="badge badge-primary text-lg">{people.length}</div>
        </div>
      </div>
    </div>
  );
}

export default TagCard;
