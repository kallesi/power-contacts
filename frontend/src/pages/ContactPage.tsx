import Picker from '../components/DatePicker';
import { useState } from 'react';
import { format } from "date-fns";

type Contact = {
  id: string;
  name: string;
  tags: string[];
  events: { date: string; description: string }[];
};

type Props = {
  contact: Contact;
  onClose: () => void;
};

function ContactPage({ contact, onClose }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };


  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='p-5 card bg-base-100 shadow-lg z-10 w-3/5 h-5/6 overflow-auto shadow-black'>
        <div className='grid grid-rows-1 grid-cols-2'>
          <h2 className='flex text-xl font-bold items-center'>
            {contact.name}
          </h2>
          <div className='flex flex-row flex-wrap justify-center items-center mt-2'>
            {contact.tags.map((tag) => (
              <div
                key={tag}
                className='badge badge-primary m-2 p-4 font-medium text-lg'
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
              </tr>
            </thead>
            <tbody>
              {contact.events.map((event, index) => (
                <tr
                  key={index}
                  className='hover'
                >
                  <th>{event.date}</th>
                  <td>{event.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex flex-col h-max'>
            <Picker onDateChange={handleDateChange} />
            <h1>Selected Date: {format(selectedDate, 'yyyy-MM-dd')}</h1>

          </div>
        </div>
      </div>
      <div
        className='fixed inset-0'
        onClick={onClose}
      ></div>
    </div>
  );
}

export default ContactPage;
