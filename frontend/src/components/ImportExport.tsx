import { BACKEND_URL } from '../constants';
import { useState } from 'react';
import Toast from './Toast';

export function ImportButton({
  className = '',
  children,
  handleUpdate,
}: {
  className?: string;
  children?: React.ReactNode;
  handleUpdate?: () => void;
}) {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);


  const handleShowToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/json') {
      console.error('Only JSON files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        if (handleUpdate) {
          handleUpdate();
        }
        handleShowToastMessage('Success');
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Reset the file input value to allow the same file to be uploaded again
      e.target.value = '';
    }
  };

  return (
    <div>
      <input
        hidden
        type='file'
        accept='.json'
        onChange={handleFileChange}
        id='file-upload'
      />
      <label htmlFor='file-upload'>
        <div className={`btn w-full ${className}`}>{children}</div>
      </label>
      {showToast && (
        <div className='fixed top-0 left-0 w-full flex items-center justify-center'>
          <div className='absolute z-50 top-2'>
            <Toast message={toastMessage} />
          </div>
        </div>
      )}
    </div>
  );
}

export function ExportButton({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {

  const handleDownload = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'download.json'; // specify the file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button
      className={`btn ${className}`}
      onClick={handleDownload}
    >
      {children}
    </button>
  );
}
