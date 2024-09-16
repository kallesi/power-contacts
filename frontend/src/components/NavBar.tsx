import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BACKEND_URL } from '../constants';

type NavBarProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  showSearch: boolean;
};

function NavBar({ searchText, setSearchText, showSearch = true }: NavBarProps) {
  const [newContact, setNewContact] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  const handleAddContact = () => {
    setIsAddingContact((prevIsAddingContact) => !prevIsAddingContact);
  };

  const handleSubmitContact = () => {
    if (newContact === '') return;
    console.log(`Adding contact: ${newContact}`);
    const req = {
      method: 'POST',
    };
    fetch(`${BACKEND_URL}/contact/create?name=${newContact}`, req)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setIsAddingContact(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='navbar bg-primary h-10'>
      <div className='flex-1'>
        <Link
          to='/app/'
          className='btn btn-ghost text-xl font-bold text-primary-content'
        >
          Power Contacts
        </Link>
        <Link
          to='/app/tags/'
          className='btn btn-ghost text-xl font-normal text-primary-content'
        >
          Tags
        </Link>
        <Link
          to='/app/events/'
          className='btn btn-ghost text-xl font-normal text-primary-content'
        >
          Events
        </Link>
        <button
          onClick={handleAddContact}
          className='btn btn-ghost text-xl font-normal text-primary-content hidden lg:inline'
        >
          Add Contact
        </button>
        {isAddingContact && (
          <div>
            <input
              type='text'
              placeholder='New Contact Name'
              className='input input-bordered w-24 md:w-auto'
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
            />
            <button
              onClick={handleSubmitContact}
              className='btn btn-primary'
            >
              Submit
            </button>
          </div>
        )}
      </div>
      {showSearch && (
        <div className='flex-row gap-2'>
          <input
            type='text'
            placeholder='Search'
            className='input input-bordered w-24 md:w-auto'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default NavBar;