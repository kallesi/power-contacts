import { useEffect, useState } from 'react';
import ContactCard from '../components/ContactCard'
import { BACKEND_URL } from '../constants';

type Event = {
  date: string
  description: string
}

type Contact = {
  id: string
  name: string
  tags: string[]
  events: Event[]
}


function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<Error | null>(null); // Explicitly define the type of error state

  useEffect(() => {
    getContacts()
      .then(data => {
        setContacts(data);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  async function getContacts() {
    const res = await fetch(`${BACKEND_URL}/contacts`);
    if (!res.ok) {
      throw new Error('Failed to fetch contacts');
    }
    const data = await res.json();
    return data;
  }

  return (
    <div className='lg:grid lg:grid-cols-4 p-5 m-5 gap-3'>
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        contacts.map(contact => (
          <ContactCard key={contact.id} {...contact} />
          // Render your ContactCard component here with appropriate props
        ))
      )}
    </div>
  );
}

export default Home;