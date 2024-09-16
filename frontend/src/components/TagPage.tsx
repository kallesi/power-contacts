import { ContactCardSimple } from './ContactCard';
import { useNavigate } from 'react-router-dom';

type Contact = {
  id: string;
  name: string;
};

type Props = {
  tag: string;
  contacts: Contact[];
  onClose: () => void;
};

function TagPage({ tag, contacts, onClose }: Props) {
  const navigate = useNavigate();


  const handleClick = (id: string) => {
    navigate(`/app/contact/${id}`);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-20'>
      <div className='p-5 card bg-base-100 shadow-lg z-10 w-3/5 h-5/6 overflow-auto shadow-black'>
        <h2 className='text-xl font-bold mb-4'>#{tag}</h2>
        <ul className='lg:grid lg:grid-cols-4 md:grid md:grid-cols-2    ml-5'>
          {contacts.map((contact) => (
            <ContactCardSimple
              name={contact.name}
              key={contact.id}
              onClick={() => handleClick(contact.id)}
            />
          ))}
        </ul>
      </div >
      <div
        className='fixed inset-0'
        onClick={onClose}
      ></div>
    </div >
  );
}

export default TagPage;
