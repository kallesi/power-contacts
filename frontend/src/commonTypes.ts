export type Event = {
  contact: string;
  contactId: string;
  eventDate: string;
  eventDescription: string;
};

export type Contact = {
  id: string;
  name: string;
  phoneNumbers: string[];
  emails: string[];
  tags: string[];
  notes: string[];
  events: ContactEvent[];
};

export type ContactEvent = {
  date: string;
  description: string;
}


export type TagContact = {
  id: string;
  name: string;
};