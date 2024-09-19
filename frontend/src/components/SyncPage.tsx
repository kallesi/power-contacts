import { useState, useEffect } from 'react';
import { ContactCardSimple } from './ContactCard';
import Toast from './Toast';
import { FiUpload, FiDownload } from "react-icons/fi";
import { IoSyncSharp } from "react-icons/io5";
import { BACKEND_URL } from '../constants';

type SyncPageProps = {
  onClose: () => void;
};

type Contact = {
  id: string;
  name: string;
  phoneNumbers: string[];
  emails: string[];
  tags: string[];
  notes: string[];
  events: Event[];
};

type SyncResults = {
  localExcessContacts: Contact[],
  remoteExcessContacts: Contact[],
  updatedContacts: Contact[]
}

function SyncPage({ onClose }: SyncPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);

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

  useEffect(() => {
    handleCheckSyncDifference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckSyncDifference = () => {
    const req = {
      method: 'GET',
    };
    setIsLoading(true)
    fetch(`${BACKEND_URL}/sync`, req)
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSyncResults(data)
        setIsLoading(false)
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }

  const handlePullToLocal = () => {
    const req = {
      method: 'PUT',
    };
    setIsLoading(true)
    fetch(`${BACKEND_URL}/sync/pull`, req)
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSyncResults(data)
        setIsLoading(false)
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handlePushToRemote = () => {
    const req = {
      method: 'PUT',
    };
    setIsLoading(true)
    fetch(`${BACKEND_URL}/sync/push`, req)
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSyncResults(data)
        setIsLoading(false)
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleShowToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div
      className='fixed inset-0 h-svh bg-black bg-opacity-50 flex justify-center items-center z-20'
      onClick={onClose}
    >
      <div
        className='mt-8 p-5 card bg-base-100 shadow-md z-50 w-3/5 h-5/6 overflow-scroll shadow-slate-950'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='grid grid-rows-1 grid-cols-1'>

          <div className='grid grid-rows-1 grid-cols-4 gap-5'>
            <div className='flex'>
              <h2 className='flex text-xl font-bold items-center min-h-14 ml-4'>Sync</h2>
              <div>
                {isLoading && (
                  <span className="loading loading-spinner loading-lg ml-4"></span>
                )}
              </div>
            </div>
            <button // Check Sync Differences
              onClick={handleCheckSyncDifference}
              className='btn btn-outline btn-primary text-lg font-normal text-white'
            ><IoSyncSharp />
            </button>
            <button // Pull to local
              onClick={handlePullToLocal}
              className='btn btn-outline btn-success text-lg font-normal text-white'
            ><FiDownload />
            </button>
            <button // Push to remote
              onClick={handlePushToRemote}
              className='btn btn-outline btn-warning text-lg font-normal text-white'
            ><FiUpload />
            </button>
          </div>
          <div className='collapse collapse-open bg-base-200 my-4'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              New Local Contacts:
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-4'>
                {syncResults?.localExcessContacts.map(contact => (
                  <ContactCardSimple
                    name={contact.name}
                    onClick={() => { }}
                  />
                ))
                }
              </div>
            </div>
          </div>

          <div className='collapse collapse-open bg-base-200 my-4'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              Local Deleted Contacts:
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-4'>
                {syncResults?.remoteExcessContacts.map(contact => (
                  <ContactCardSimple
                    name={contact.name}
                    onClick={() => { }}
                  />
                ))
                }
              </div>
            </div>
          </div>

          <div className='collapse collapse-open bg-base-200 my-4'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              Updated Contacts:
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-4'>
                {syncResults?.updatedContacts.map(contact => (
                  <ContactCardSimple
                    name={contact.name}
                    onClick={() => { }}
                  />
                ))
                }
              </div>
            </div>
          </div>


          {showToast && (
            <div className='fixed top-0 left-0 w-full flex items-center justify-center'>
              <div className='absolute z-50 top-2'>
                <Toast message={toastMessage} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SyncPage;
