import { ContactCardSimple } from './ContactCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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


  const handleClick = (id: string) => {
    navigate(`/app/contact/${id}`);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-20'>
      <div className='p-5 card bg-base-100 shadow-lg z-10 w-3/4 h-5/6 overflow-auto shadow-black'>
        <h2 className='text-xl font-bold mb-4'>#{tag}</h2>
        <ul className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 sm:grid sm:grid-cols-1 ml-5'>
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
