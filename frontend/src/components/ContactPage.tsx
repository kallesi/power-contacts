import Picker from './DatePicker';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BACKEND_URL } from '../constants';
import { FaExpandAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Toast from './Toast';
import { IoAddOutline } from 'react-icons/io5';
import { MdUpdate } from 'react-icons/md';
import ContactEventsTable from './ContactEventsTable';
import { ContactEvent } from '../commonTypes';

type Event = {
  date: string;
  description: string;
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

type Props = {
  contact: Contact;
  onClose: () => void;
};

function ContactPage({ contact, onClose }: Props) {
  const [contactState, setContact] = useState<Contact>(contact);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventText, setEventText] = useState('');
  const [tagText, setTagText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [phonesEmailsText, setPhonesEmailsText] = useState('');
  const [somethingChanged, setSomethingChanged] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (contact) {
      const allNotes = contact.notes.join('\n');
      setNotesText(allNotes);

      const phoneNumbers = contact.phoneNumbers.join('\n');
      const emails = contact.emails.join('\n');
      const combinedPhoneEmails = `${phoneNumbers}\n${emails}`;
      setPhonesEmailsText(combinedPhoneEmails);
    }
  }, [contact]);

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

  const handleClose = () => {
    if (somethingChanged) {
      onClose();
      window.location.reload();
    } else {
      onClose();
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDeleteEvent = (eventToDelete: Event) => {
    const req = {
      method: 'DELETE',
    };
    fetch(
      `${BACKEND_URL}/contact/${contactState.id}?date=${eventToDelete.date}`,
      req
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Event deleted:', data);
        setContact(data);
        setSomethingChanged(true);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const autofillEventDetails = (event: ContactEvent) => {
    setEventText(event.description);
    setSelectedDate(new Date(event.date));
  };

  const handleSubmitEvent = () => {
    if (eventText === '') return;
    let matched = false;
    contactState.events.forEach((event) => {
      if (event.date === format(selectedDate, 'yyyy-MM-dd')) {
        matched = true;
      }
    });

    const req = {
      method: matched ? 'PUT' : 'POST',
    };
    fetch(
      `${BACKEND_URL}/contact/${contactState.id}?date=${format(
        selectedDate,
        'yyyy-MM-dd'
      )}&description=${eventText}`,
      req
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setContact(data);
        setEventText('');
        setSomethingChanged(true);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleAddTag = () => {
    if (tagText === '' || tagText.startsWith(' ')) return;
    const matched = contactState.tags.includes(tagText);
    if (!matched) {
      const req = {
        method: 'POST',
      };
      fetch(`${BACKEND_URL}/contact/${contactState.id}?tag=${tagText}`, req)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Success:', data);
          setContact(data);
          setTagText('');
          setSomethingChanged(true);
          handleShowToastMessage('Success');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleDeleteTag = (tag: string) => {
    const req = {
      method: 'DELETE',
    };
    fetch(`${BACKEND_URL}/contact/${contactState.id}?tag=${tag}`, req)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setContact(data);
        setSomethingChanged(true);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdateNotes = () => {
    let encodedNotesText;
    if (notesText === '') {
      encodedNotesText = '';
    }
    encodedNotesText = encodeURIComponent(notesText);
    const req = {
      method: 'PUT',
    };
    fetch(
      `${BACKEND_URL}/contact/${contactState?.id}?notes=${encodedNotesText}`,
      req
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setContact(data);

        const allNotes = data.notes.join('\n');
        console.log(`Notes updated to ${allNotes}`);
        setSomethingChanged(true);
        setNotesText(allNotes);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdatePhonesEmails = () => {
    let encodedText;
    if (phonesEmailsText === '') {
      encodedText = '';
    }
    encodedText = encodeURIComponent(phonesEmailsText);
    const req = {
      method: 'PUT',
    };
    fetch(
      `${BACKEND_URL}/contact/${contactState?.id}?phone_email_multiline=${encodedText}`,
      req
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setContact(data);
        const phoneNumbers = data.phoneNumbers.join('\n');
        const emails = data.emails.join('\n');
        const combinedPhoneEmails = `${phoneNumbers}\n${emails}`;
        setPhonesEmailsText(combinedPhoneEmails);
        console.log(`Phones/emails updated to ${combinedPhoneEmails}`);
        setSomethingChanged(true);
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleShowToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
      <div className='p-5 card bg-base-100 shadow-lg z-10 w-2/3 overflow-y-auto h-5/6 shadow-black relative'>
        <div className='absolute top-4 right-4 z-50'>
          <Link to={`/app/contact/${contactState.id}`}>
            <button className='btn btn-neutral'>
              <FaExpandAlt />
            </button>
          </Link>
        </div>
        <div className='grid grid-rows-1 grid-cols-2'>
          <h2 className='flex text-xl font-bold items-center min-h-14'>
            {contactState.name}
          </h2>
          <div className='flex flex-row flex-wrap justify-center items-center mt-2 mr-12'>
            {contactState.tags.map((tag) => (
              <div
                key={tag}
                className='badge badge-primary m-2 p-4 font-medium text-lg hover:bg-slate-400 hover:border-inherit transition-all ease-linear'
                onClick={() => handleDeleteTag(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className='divider'></div>
        {contactState && contactState.events.length > 0 && (
          <ContactEventsTable
            contact={contactState}
            handleDeleteEvent={handleDeleteEvent}
            autofillEventDetails={autofillEventDetails}
          />
        )}
        <div className='h-full relative'>
          <div className='grid grid-cols-2 gap-3'>
            {/* Main 4 elem grid */}
            <div className='grid grid-rows-2 grid-cols-3 gap-4 m-2 items-center justify-between'>
              {' '}
              {/*Events*/}
              <h1 className='flex flex-row font-bold items-center'>
                Add Event
              </h1>
              <Picker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onDateChange={handleDateChange}
              />
              <button
                className='btn btn-xs btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md'
                onClick={handleSubmitEvent}
              >
                <IoAddOutline size={20} />
              </button>
              <input
                type='text'
                placeholder='Event description'
                className='input input-bordered col-span-3'
                value={eventText}
                onChange={(e) => setEventText(e.target.value)}
              />
            </div>
            <div className='grid grid-rows-2 grid-cols-3 gap-4 m-2 items-center justify-between'>
              {' '}
              {/*Tags*/}
              <h1 className='flex flex-row font-bold items-center col-span-2'>
                Add Tag
              </h1>
              <button
                className='btn btn-xs btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md'
                onClick={handleAddTag}
              >
                <IoAddOutline size={20} />
              </button>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-auto col-span-3'
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
              />
            </div>
            <div className='divider col-span-2'></div>
            <div className='grid grid-rows-5 grid-cols-3 gap-4 m-2 items-center justify-between'>
              {' '}
              {/*Phones*/}
              <h1 className='font-bold col-span-2'>Numbers/Emails</h1>
              <button
                className='btn btn-xs btn-primary btn-outline sm:btn-sm md:btn-md lg:btn-md'
                onClick={handleUpdatePhonesEmails}
              >
                <MdUpdate size={20} />
              </button>
              <textarea
                placeholder='Emails & Numbers'
                className='textarea textarea-bordered sm:h-30 lg:h-60 textarea-lg w-full col-span-3 row-span-4'
                value={phonesEmailsText.replace(/\n/g, '\n')}
                onChange={(e) => {
                  setPhonesEmailsText(e.target.value);
                }}
              ></textarea>
            </div>
            <div className='grid grid-rows-5 grid-cols-3 gap-4 m-2 items-center justify-between'>
              {' '}
              {/*Notes*/}
              <h1 className='font-bold col-span-2'>Notes</h1>
              <button
                className='btn btn-primary btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md'
                onClick={handleUpdateNotes}
              >
                <MdUpdate size={20} />
              </button>
              <textarea
                placeholder='Notes'
                className='textarea sm:h-30 lg:h-60 textarea-bordered textarea-lg w-full col-span-3 row-span-4'
                value={notesText.replace(/\n/g, '\n')}
                onChange={(e) => setNotesText(e.target.value)}
              ></textarea>
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
      <div
        className='fixed inset-0'
        onClick={handleClose}
      ></div>
    </div>
  );
}

export default ContactPage;
