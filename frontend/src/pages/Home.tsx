import { useState } from 'react';
import ContactCard from '../components/ContactCard';
import ContactPage from '../pages/ContactPage';
import { BACKEND_URL } from '../constants';
import useFetch from '../hooks/useFetch';

type Event = {
  date: string;
  description: string;
};

type Contact = {
  id: string;
  name: string;
  tags: string[];
  events: Event[];
};

function Home() {
  const { data: contacts } = useFetch<Contact[]>(`${BACKEND_URL}/contacts`);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);


  function handleCardClick(contact: Contact) {
    setSelectedContact(contact);
  }

  function handleCloseOverlay() {
    setSelectedContact(null);
  }

  return (
    <div className="md:grid md:grid-cols-4 p-5 m-5 gap-3">
      {contacts?.map(contact => (
        <ContactCard key={contact.id} {...contact} onClick={() => handleCardClick(contact)} />
      ))}
      {selectedContact && (
        <ContactPage contact={selectedContact} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}

export default Home;