type ContactCardProps = {
  name: string
  tags: string[]
}


function ContactCard({ name, tags }: ContactCardProps) {

  return (
    <div className='card bg-base-100 m-2 p-2 shadow-xl hover:bg-base-200 hover:transition-all hover:ease-linear'>
      <div className='card-body'>
        <h2 className='card-title self-center'>
          {name}
        </h2>
        <div className='flex flex-row flex-wrap justify-center items-center'>
          {tags.map(tag => (
            <div className='badge badge-primary m-1 p-2 font-medium'>{tag}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactCard;
