from datetime import datetime, date
from enum import Enum
from event import Event

class ContactField(Enum):
    names: str = 'names'
    text: str = 'biographies'

class Contact:
    def __init__(self,
                 id: str,
                 names: str,
                 text: str,
    ):
        self.id = id
        self.name = names
        text_attributes = self._split_text(text)
        self.tags, self.events, self.notes = self._process_plain_text(text_attributes)
    def __repr__(self):
        return self.name
    def __str__(self):
        return self.name
    def _split_text(self, text) -> list[str]:
        return text.split('\n')
    def _process_plain_text(self, text_attributes)-> tuple[list]:
        tags = []
        events = []
        notes = []
        for attribute in text_attributes:
            if attribute[:1] == '#':
                tags.append(attribute[1:])
            elif attribute[:1] == ':':
                text_after_colon = attribute[1:]
                position_of_space_char = text_after_colon.find(' ')
                event_date = text_after_colon[:position_of_space_char]
                event_description = text_after_colon[(position_of_space_char + 1):]
                events.append(Event(event_date, event_description))
            else:
                notes.append(attribute)
        return tags, events, notes

    def get_sorted_plain_text(self) -> str:
        text_attributes = []
        for tag in self.tags:
            text_attributes.append(f'#{tag}')
        for event in self.events:
            text_attributes.append(f':{event.date} {event.description}')
        for note in self.notes:
            text_attributes.append(note)
        plain_text = "\n".join(text_attributes)
        return plain_text


def create_contact_object(contact_response: dict):

    id: str = contact_response.get('resourceName', '')
    if not id == '':
        id = id.replace('people/', '')
    names: str = contact_response.get('names', '')
    if not names == '':
        names = names[0].get('displayName')
    biographies: str = contact_response.get('biographies', '')
    if not biographies == '':
        biographies = biographies[0].get('value', '')
    person = Contact(
            id=id,
            names=names,
            text=biographies
    )
    return person

