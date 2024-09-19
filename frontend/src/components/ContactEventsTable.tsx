
import type { Contact, ContactEvent } from '../commonTypes';

type EventsTableProps = {
  contact: Contact;
  open?: boolean;
  handleDeleteEvent: (event: ContactEvent) => void;
  autofillEventDetails: (event: ContactEvent) => void;
}

function ContactEventsTable({ contact, open = false, handleDeleteEvent, autofillEventDetails }: EventsTableProps) {
  return (
    <div className={`collapse ${open && 'collapse-open'} overflow-visible collapse-arrow bg-base-200 w-full my-3`}>
      <input type='checkbox' />
      <div className='collapse-title text-xl font-medium'>
        Events ({contact.events.length})
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
            {contact.events
              .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateA - dateB;
              })
              .map((event, index) => (
                <tr key={index} className='hover:bg-base-100 hover:transition-all hover:ease-linear' onClick={() => autofillEventDetails(event)}>
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
  )
}

export default ContactEventsTable;