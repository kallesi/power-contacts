import { useState, useEffect } from 'react';

const Toast = ({ message }: { message: string }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      {showToast && (
        <div className='alert alert-success flex flex-row items-center shadow-black shadow-lg'>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default Toast;
