from event import add_event, remove_event, update_event
from google_api import get_contact, get_contacts, get_plain_text, update_contact_plain_text
from google_api import delete_contact, create_contact, rename_contact
from contact import Contact, create_contact_object
from collections import defaultdict
from tag import add_tag, remove_tag, update_tag
from datetime import datetime
def handle_get_contacts():
    contacts: list = get_contacts()
    contact_objects = []
    for contact in contacts:
        contact_objects.append(
            create_contact_object(contact)
        )
    return contact_objects

def handle_get_tags():
    contact_objects: list[Contact] = handle_get_contacts()
    tags_dict = defaultdict(list)
    for contact in contact_objects:
        for tag in set(contact.tags):  # Using set to get unique tags
            tags_dict[tag].append({
                'id': contact.id,
                'name': contact.name,
            })
    sorted_tags_dict = {tag: tags_dict[tag] for tag in sorted(tags_dict)}
    return sorted_tags_dict

def handle_get_tag(tag: str):
    tags: dict = handle_get_tags()
    matched_tags = {}
    for key, val in tags.items():
        if key.startswith(tag):
            matched_tags[key] = val
    return matched_tags

def handle_get_events() -> dict[list[dict]]:
    contact_objects: list[Contact] = handle_get_contacts()
    events_dict = defaultdict(list)
    for contact in contact_objects:
        for event in contact.events:
            date = event.date
            if date:
                events_dict[date].append({
                    'contact': contact.name,
                    'contactId': contact.id,
                    'eventDate': event.date,
                    'eventDescription': event.description
                })
    sorted_events = sorted(events_dict.items(), key=lambda x: datetime.strptime(x[0], '%Y-%m-%d'))
    sorted_events_dict = {date: events for date, events in sorted_events}
    return sorted_events_dict

def handle_get_event(date: str):
    events: dict[list[dict]] = handle_get_events()
    matched_events = []
    for key, val in events.items():
        if key.startswith(date):
            for event in val:
                matched_events.append(event)
    return matched_events


def handle_get_contact(id: str):
    contact: dict = get_contact(id)
    return create_contact_object(contact)

def handle_add_tag(id: str, tag: str):

    plain_text = get_plain_text(id)
    new_text = add_tag(
        plain_text=plain_text,
        tag=tag
    )
    new_contact = update_contact_plain_text(id, new_text)
    return create_contact_object(new_contact)

def handle_remove_tag(id: str, tag: str):
    plain_text = get_plain_text(id)
    new_text = remove_tag(
        plain_text=plain_text,
        tag=tag
    )
    new_contact = update_contact_plain_text(id, new_text)
    return create_contact_object(new_contact)

def handle_update_tag(id: str, old_tag: str, new_tag: str):
    plain_text = get_plain_text(id)
    new_text = update_tag(
        plain_text=plain_text,
        old_tag=old_tag,
        new_tag=new_tag
    )
    new_contact = update_contact_plain_text(id, new_text)
    return create_contact_object(new_contact)

def handle_add_event(id: str, date: str, description: str):
    plain_text = get_plain_text(id)
    new_text = add_event(
        plain_text=plain_text,
        date=date,
        description=description
    )
    new_contact = update_contact_plain_text(id, new_text)
    return create_contact_object(new_contact)

def handle_remove_event(id: str, date: str):
    plain_text = get_plain_text(id)
    new_text = remove_event(
        plain_text=plain_text,
        date=date
    )
    new_contact = update_contact_plain_text(id, new_text)
    return create_contact_object(new_contact)

def handle_update_event(id: str, date: str, description: str):
    plain_text = get_plain_text(id)
    new_text = update_event(
        plain_text=plain_text,
        date=date,
        description=description
    )
    new_contact = update_contact_plain_text(id, new_text)
    return create_contact_object(new_contact)

def handle_update_notes(id: str, notes: str):
    note_strings = notes.split('\n')
    contact: Contact = create_contact_object(get_contact(id))
    contact.notes = note_strings
    plain_text = contact.get_sorted_plain_text()
    new_contact = update_contact_plain_text(id, plain_text)
    return create_contact_object(new_contact)

def handle_create_contact(name: str):
    new_contact = create_contact(name)
    return create_contact_object(new_contact)

def handle_delete_contact(id: str):
    deleted_contact = delete_contact(id)
    return deleted_contact

def handle_rename_contact(id: str, name: str):
    renamed_contact = rename_contact(id, name)
    return create_contact_object(renamed_contact)