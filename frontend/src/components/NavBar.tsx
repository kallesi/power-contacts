import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '../constants';
import favicon from '../assets/favicon.png';
import SyncPage from '../components/SyncPage';

import { IoSyncSharp } from 'react-icons/io5';
import { LiaTagSolid } from 'react-icons/lia';
import { MdEventAvailable } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { LuSendHorizonal } from 'react-icons/lu';

type NavBarProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  showSearch: boolean;
};

function NavBar({ searchText, setSearchText, showSearch = true }: NavBarProps) {
  const [newContact, setNewContact] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [syncIsOpen, setSyncIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateOrRefresh = useCallback(
    (path: string) => {
      if (location.pathname === path) {
        navigate('/');
        setTimeout(() => {
          navigate(path);
        }, 1);
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
          case 's':
            event.preventDefault();
            handleOpenSyncPage();
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

  useEffect(() => {
    if (isAddingContact) {
      document.getElementById('addContactInputBox')?.focus();
    }
  }, [isAddingContact]);

  const handleOpenSyncPage = () => {
    setSyncIsOpen(true);
  };

  const handleCloseSyncPage = (returnToOriginalPath: boolean = true) => {
    setSyncIsOpen(false);
    if (returnToOriginalPath) {
      const originalPath = location.pathname;
      navigate('/');
      setTimeout(() => {
        navigate(originalPath);
      }, 1);
    }
  };

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
        const currentPath = location.pathname;
        navigate('/');
        setTimeout(() => {
          navigate(currentPath);
        }, 1);
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
          className={`btn text-lg font-normal text-white ${location.pathname == '/app/tags/' && !syncIsOpen
            ? 'btn-neutral'
            : 'btn-ghost'
            }`}
        >
          <LiaTagSolid size={30} />
        </button>
        <button
          onClick={() => navigateOrRefresh('/app/events/')}
          className={`btn text-lg font-normal text-white ${location.pathname == '/app/events/' && !syncIsOpen
            ? 'btn-neutral'
            : 'btn-ghost'
            }`}
        >
          <MdEventAvailable size={26} />
        </button>
        <button
          onClick={handleOpenSyncPage}
          className={`btn text-lg font-normal text-white ${syncIsOpen ? 'btn-neutral' : 'btn-ghost'
            }`}
        >
          <IoSyncSharp size={25} />
        </button>
        <button
          onClick={handleAddContact}
          className={`btn text-lg font-normal text-white ${isAddingContact ? 'btn-neutral' : 'btn-ghost'
            }`}
        >
          <IoIosAddCircleOutline size={26} />
        </button>
        {isAddingContact && (
          <div>
            <input
              type='text'
              id='addContactInputBox'
              placeholder='New Contact Name'
              className='input input-bordered w-24 md:w-auto mx-2'
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
            />
            <button
              onClick={handleSubmitContact}
              className='btn btn-primary btn-outline'
            >
              <LuSendHorizonal />
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
      {syncIsOpen && <SyncPage onClose={handleCloseSyncPage} />}
    </div>
  );
}

export default NavBar;
