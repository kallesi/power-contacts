import { useState, useEffect } from 'react';
import { ContactCard } from '../components/ContactCard';
import ContactPage from '../components/ContactPage';
import { BACKEND_URL } from '../constants';
import useFetch from '../hooks/useFetch';
import NavBar from '../components/NavBar';

type Event = {
  date: string;
  description: string;
};

type Contact = {
  id: string;
  name: string;
  tags: string[];
  notes: string[]
  events: Event[];
};

function Home() {
  const { data: contacts } = useFetch<Contact[]>(
    `${BACKEND_URL}/contacts`,
    'GET'
  );
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setLocalContacts(contacts || []);
  }, [contacts]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setLocalContacts(contacts || []);
    } else {
      setLocalContacts((prevContacts) =>
        prevContacts.filter((contact) =>
          contact.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, contacts]);

  function handleCardClick(contact: Contact) {
    setSelectedContact(contact);
  }

  function handleCloseOverlay() {
    setSelectedContact(null);
  }

  return (
    <div>
      <div className='fixed top-0 left-0 w-full z-10'>
        <NavBar
          searchText={searchText}
          setSearchText={setSearchText}
          showSearch={true}
        />
      </div>
      <div className='mt-20'>
        <div className='md:grid md:grid-cols-4 p-5 m-5 gap-3'>
          {localContacts?.map((contact) => (
            <ContactCard
              key={contact.id}
              {...contact}
              onClick={() => handleCardClick(contact)}
            />
          ))}
          {selectedContact && (
            <ContactPage
              contact={selectedContact}
              onClose={handleCloseOverlay}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
