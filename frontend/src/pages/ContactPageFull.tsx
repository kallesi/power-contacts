import Picker from '../components/DatePicker';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BACKEND_URL } from '../constants';
import useFetch from '../hooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { MdDelete, MdDriveFileRenameOutline } from 'react-icons/md';
import { IoAddOutline } from 'react-icons/io5';
import { MdUpdate } from 'react-icons/md';
import Toast from '../components/Toast';

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

function ContactPageFull() {
  const { id } = useParams();
  const { data: contact } = useFetch<Contact | null>(
    `${BACKEND_URL}/contact/${id}`,
    'GET'
  );
  const [contactState, setContact] = useState<Contact | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventText, setEventText] = useState('');
  const [tagText, setTagText] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamedContactName, setRenamedContactName] = useState('');
  const [notesText, setNotesText] = useState('');
  const [phonesEmailsText, setPhonesEmailsText] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setContact(contact);
    if (contact) {
      const allNotes = contact.notes.join('\n');
      setNotesText(allNotes);

      const phoneNumbers = contact.phoneNumbers.join('\n');
      const emails = contact.emails.join('\n');
      const combinedPhoneEmails = `${phoneNumbers}\n${emails}`;
      setPhonesEmailsText(combinedPhoneEmails);

      setRenamedContactName(contact.name);
    }
  }, [contact]);

  const handleRedirect = () => {
    navigate(`/app/`);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDeleteEvent = (eventToDelete: Event) => {
    if (!contactState) return;
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
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSubmitEvent = () => {
    if (eventText === '') return;
    if (!contactState) return;
    const matched = contactState.events.some(
      (event) => event.date === format(selectedDate, 'yyyy-MM-dd')
    );

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
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleAddTag = () => {
    if (tagText === '') return;
    if (!contactState) return;
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
          handleShowToastMessage('Success');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleDeleteTag = (tag: string) => {
    if (!contactState) return;
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
        handleShowToastMessage('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDeleteContact = () => {
    if (!contactState) return;
    const req = {
      method: 'DELETE',
    };
    fetch(
      `${BACKEND_URL}/contact/${contactState.id}?delete_contact=${true}`,
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
        handleRedirect();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const toggleIsRenaming = () => {
    setIsRenaming((prevIsRenaming) => !prevIsRenaming);
  };

  const handleRenameContact = () => {
    if (renamedContactName === '') return;
    if (!contactState) return;
    console.log(
      `Renaming contact: from ${contactState?.name} to ${renamedContactName}`
    );
    const req = {
      method: 'PUT',
    };
    fetch(
      `${BACKEND_URL}/contact/${contactState.id}?rename_new_name=${renamedContactName}`,
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
        toggleIsRenaming();
        setRenamedContactName(data.name);
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
    encodedNotesText = encodeURIComponent(notesText); // Encode the notesText
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
    <div>
      <div className='fixed top-0 left-0 w-full z-10'>
        <NavBar
          showSearch={false}
          searchText=''
          setSearchText={() => { }}
        />
      </div>
      <div className='lg:px-40 md:px-35 sm:px-30 px-20 py-5 mt-20 relative'>
        {isRenaming && (
          <div className='flex flex-row justify-end'>
            <input
              type='text'
              placeholder='New Contact Name'
              className='input input-bordered w-24 md:w-auto p-2 m-2'
              value={renamedContactName}
              onChange={(e) => setRenamedContactName(e.target.value)}
            />
            <button
              onClick={handleRenameContact}
              className='btn btn-primary btn-outline p-2 m-2'
            >
              Submit
            </button>
          </div>
        )}
        {contactState && (
          <div>
            <div className='absolute top-4 right-4'>
              <button
                onClick={handleDeleteContact}
                className='btn btn-neutral'
              >
                <MdDelete size={20} />
              </button>
            </div>
            <div className='absolute top-20 right-4'>
              <button
                onClick={toggleIsRenaming}
                className='btn btn-neutral'
              >
                <MdDriveFileRenameOutline size={20} />
              </button>
            </div>
          </div>
        )}
        <div className='mt-15 grid grid-rows-1 grid-cols-2'>
          <h2 className='flex text-xl font-bold items-center min-h-14'>
            {contactState?.name}
          </h2>
          <div className='flex flex-row flex-wrap justify-center items-center mt-2'>
            {contactState?.tags.map((tag) => (
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
        {contactState && contactState.events.length > 0 && (
          <div className='collapse collapse-open overflow-visible bg-base-200 w-full my-3'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              Events ({contactState.events.length})
            </div>
            <div className='collapse-content'>
              <table className='table table-md'>
                <thead>
                  <tr className='text-base'>
                    <th>Date</th>
                    <th>Event</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contactState.events
                    .sort((a, b) => {
                      const dateA = new Date(a.date).getTime();
                      const dateB = new Date(b.date).getTime();
                      return dateA - dateB;
                    })
                    .map((event, index) => (
                      <tr key={index}>
                        <th>{event.date}</th>
                        <td>{event.description}</td>
                        <td>
                          <button
                            className='btn btn-outline btn-sm btn-error'
                            onClick={() => handleDeleteEvent(event)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="divider"></div>
        <div className='overflow-x-auto h-full relative'>
          <div className='grid grid-cols-2 gap-3'> {/*Main 4-element grid*/}
            <div className='grid grid-rows-2 grid-cols-3 gap-4 m-2 items-center justify-between'> {/*Events*/}
              <h1 className='flex flex-row font-bold items-center'>
                Add Event
              </h1>
              <Picker onDateChange={handleDateChange} />

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
            <div className='grid grid-rows-2 grid-cols-3 gap-4 m-2 items-center justify-between'> {/*Tags*/}
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
            <div className="divider col-span-2"></div>
            <div className='grid grid-rows-5 grid-cols-3 gap-4 m-2 items-center justify-between'> {/*Phones/emails*/}
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
            <div className='grid grid-rows-5 grid-cols-3 gap-4 m-2 items-center justify-between'> {/*Notes*/}
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
        </div>
        {showToast && (
          <div className='fixed top-20 left-0 w-full flex items-center justify-center'>
            <div className='absolute z-50 top-2'>
              <Toast message={toastMessage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactPageFull;
