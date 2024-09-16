import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BACKEND_URL } from '../constants';
import favicon from '../assets/favicon.png';

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
        setNewContact('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='navbar bg-base-300 h-10  shadow-2xl drop-shadow-lg shadow-gray-950'>
      <div className='flex-1'>
        <Link
          to='/app/'
          className='btn btn-ghost text-xl font-bold text-white'
        >
          <div className='flex flex-row'>
            <img src={favicon} alt="icon" width={30} height={20} />
            <div className='p-2'></div>
            <h1 className='text-white'>Power Contacts</h1>
          </div>
        </Link>
        <Link
          to='/app/tags/'
          className='btn btn-ghost text-lg font-normal  text-white'
        >
          Tags
        </Link>
        <Link
          to='/app/events/'
          className='btn btn-ghost text-lg font-normal text-white'
        >
          Events
        </Link>
        <button
          onClick={handleAddContact}
          className='btn btn-ghost text-lg font-normal  text-white'
        >
          Add Contact
        </button>
        {isAddingContact && (
          <div>
            <input
              type='text'
              placeholder='New Contact Name'
              className='input input-bordered w-24 md:w-auto mx-2'
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