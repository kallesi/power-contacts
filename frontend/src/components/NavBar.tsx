import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();

  const navigateOrRefresh = useCallback(
    (path: string) => {
      if (location.pathname === path) {
        window.location.reload();
      } else {
        navigate(path);
      }
    },
    [navigate, location.pathname]
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
      }

      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'h':
            event.preventDefault();
            navigateOrRefresh('/app/');
            break;
          case 't':
            event.preventDefault();
            navigateOrRefresh('/app/tags/');
            break;
          case 'e':
            event.preventDefault();
            navigateOrRefresh('/app/events/');
            break;
          case 'a':
            event.preventDefault();
            handleAddContact();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [navigateOrRefresh]);

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
    <div className='navbar bg-base-300 h-10 shadow-2xl drop-shadow-lg shadow-gray-950'>
      <div className='flex-1'>
        <button
          onClick={() => navigateOrRefresh('/app/')}
          className='btn btn-ghost text-xl font-bold text-white'
        >
          <div className='flex flex-row'>
            <img
              src={favicon}
              alt='icon'
              width={30}
              height={20}
            />
            <div className='p-2'></div>
            <h1 className='text-white'>Power Contacts</h1>
          </div>
        </button>
        <button
          onClick={() => navigateOrRefresh('/app/tags/')}
          className='btn btn-ghost text-lg font-normal text-white'
        >
          Tags
        </button>
        <button
          onClick={() => navigateOrRefresh('/app/events/')}
          className='btn btn-ghost text-lg font-normal text-white'
        >
          Events
        </button>
        <button
          onClick={handleAddContact}
          className='btn btn-ghost text-lg font-normal text-white'
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
            id='searchInput'
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