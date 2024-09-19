import { useState, useEffect } from 'react';
import { ContactCardSimple } from './ContactCard';
import Toast from './Toast';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { IoSyncSharp } from 'react-icons/io5';
import { BACKEND_URL } from '../constants';
import { ExportButton, ImportButton } from './ImportExport';
import { Contact } from '../commonTypes';
import { useNavigate } from 'react-router-dom';

type SyncPageProps = {
  onClose: (returnToOriginalPath: boolean) => void;
};

type SyncResults = {
  localExcessContacts: Contact[];
  remoteExcessContacts: Contact[];
  updatedContacts: Contact[];
};

function SyncPage({ onClose }: SyncPageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(true);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    handleCheckSyncDifference();
  }, []);

  const handleCheckSyncDifference = () => {
    const req = {
      method: 'GET',
    };
    setIsLoading(true);
    fetch(`${BACKEND_URL}/sync`, req)
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSyncResults(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  const handlePullToLocal = () => {
    const req = {
      method: 'PUT',
    };
    setIsLoading(true);
    fetch(`${BACKEND_URL}/sync/pull`, req)
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSyncResults(data);
        setIsLoading(false);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePushToRemote = () => {
    const req = {
      method: 'PUT',
    };
    setIsLoading(true);
    fetch(`${BACKEND_URL}/sync/push`, req)
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSyncResults(data);
        setIsLoading(false);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleRedirect = (contact: Contact) => {
    navigate(`/app/contact/${contact.id}`);
    onClose(false);

  };

  const handleShowToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div
      className='fixed inset-0 h-svh bg-black bg-opacity-50 flex justify-center items-center z-10'
      onClick={() => { onClose(true) }}
    >
      <div
        className='mt-8 p-5 card bg-base-100 shadow-md z-20 w-3/5 h-5/6 flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex-none'>
          <div className='flex'>
            <h2 className='flex text-xl font-bold items-center min-h-14 ml-4'>
              Sync
            </h2>
            {isLoading && (
              <span className='loading loading-spinner loading-lg ml-4'></span>
            )}
          </div>
          <div className='grid grid-cols-3 gap-5 mt-4'>
            <button
              onClick={handleCheckSyncDifference}
              className='btn btn-outline btn-primary text-lg font-normal text-white'
            >
              <IoSyncSharp />
            </button>
            <button
              onClick={handlePullToLocal}
              className='btn btn-outline btn-success text-lg font-normal text-white'
            >
              <FiDownload />
            </button>
            <button
              onClick={handlePushToRemote}
              className='btn btn-outline btn-warning text-lg font-normal text-white'
            >
              <FiUpload />
            </button>
          </div>
        </div>

        <div className='flex-grow overflow-y-auto mt-4'>
          <div className='collapse collapse-open bg-base-200 my-4'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              New Local Contacts:
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-3'>
                {syncResults?.localExcessContacts.map((contact) => (
                  <ContactCardSimple
                    key={contact.id}
                    name={contact.name}
                    onClick={() => {
                      handleRedirect(contact);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='collapse collapse-open bg-base-200 my-4'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              Local Deleted Contacts:
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-3'>
                {syncResults?.remoteExcessContacts.map((contact) => (
                  <ContactCardSimple
                    key={contact.id}
                    name={contact.name}
                    onClick={() => {
                      handleRedirect(contact);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='collapse collapse-open bg-base-200 my-4'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              Updated Contacts:
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-3'>
                {syncResults?.updatedContacts.map((contact) => (
                  <ContactCardSimple
                    key={contact.id}
                    name={contact.name}
                    onClick={() => {
                      handleRedirect(contact);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='flex-none mt-4'>
          <div className='grid grid-cols-2 gap-4 mx-2'>
            <ImportButton
              handleUpdate={handleCheckSyncDifference}
              className='btn-info btn-outline font-bold text-base'
            >
              Import
            </ImportButton>
            <ExportButton className='btn-error btn-outline font-bold text-base'>
              Export
            </ExportButton>
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
  );
}

export default SyncPage;
