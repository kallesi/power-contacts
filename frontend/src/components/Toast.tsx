import { useState, useEffect } from 'react';

type ToastProps = {
  message: string
}

const Toast = ({ message }: ToastProps) => {
  const [showToast, setShowToast] = useState(true);

  let error: boolean;
  if (message.includes('Error')) {
    error = true;
  } else {
    error = false;
  }

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
        <div className={`alert ${error ? 'alert-error' : 'alert-success'} flex flex-row items-center shadow-black shadow-lg`}>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default Toast;
