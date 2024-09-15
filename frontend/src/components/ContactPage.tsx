import Picker from './DatePicker';
import { useState } from 'react';
import { format } from 'date-fns';
import { BACKEND_URL } from '../constants';
import { FaExpandAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Event = {
  date: string;
  description: string;
};

type Contact = {
  id: string;
  name: string;
  tags: string[];
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
  const [somethingChanged, setSomethingChanged] = useState(false);

  const handleClose = () => {
    // check if need to reload
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSubmitEvent = () => {
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleAddTag = () => {
    let matched = false;
    contact.tags.forEach((tag) => {
      if (tag === tagText) {
        matched = true;
      }
    });
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
      <div className='p-5 card bg-base-100 shadow-lg z-10 w-3/5 h-5/6 overflow-auto shadow-black relative'>
        <div className='absolute top-4 right-4'>
          <Link to={`/app/contact/${contactState.id}`}>
            <button className='btn btn-neutral'>
              <FaExpandAlt />
            </button>
          </Link>
        </div>
        <div className='grid grid-rows-1 grid-cols-2'>
          <h2 className='flex text-xl font-bold items-center'>
            {contactState.name}
          </h2>
          <div className='flex flex-row flex-wrap justify-center items-center mt-2'>
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
        <div className='overflow-x-auto h-full relative'>
          <table className='table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {contactState.events.map((event, index) => (
                <tr
                  key={index}
                  className='hover'
                >
                  <th>{event.date}</th>
                  <td>{event.description}</td>
                  <td>
                    <button
                      className='btn btn-outline btn-error'
                      onClick={() => handleDeleteEvent(event)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='grid grid-cols-2 grid-rows-1'>
            <div className='grid grid-rows-3 grid-cols-1 m-2'>
              <Picker onDateChange={handleDateChange} />
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-auto'
                value={eventText}
                onChange={(e) => setEventText(e.target.value)}
              />
              <button
                className='btn btn-xs sm:btn-sm md:btn-md lg:btn-md'
                onClick={handleSubmitEvent}
              >
                Add Event
              </button>
            </div>
            <div className='grid grid-rows-3 grid-cols-1 m-2'>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-auto'
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
              />
              <div></div>
              <button
                className='btn btn-xs sm:btn-sm md:btn-md lg:btn-md'
                onClick={handleAddTag}
              >
                Add Tag
              </button>
            </div>
          </div>
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
