from google_api import get_contact, get_contacts, get_plain_text, update_contact_plain_text
from contact import Contact, create_contact_object
from collections import defaultdict
from tag import add_tag, remove_tag, update_tag
from event import add_event, remove_event, update_event

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
            tags_dict[tag].append(contact)
    return tags_dict

def handle_get_events():
    contact_objects: list[Contact] = handle_get_contacts()
    events_dict = defaultdict(set)
    for contact in contact_objects:
        for event in contact.events:
            date = event.date
            if date:
                events_dict[date].add(contact)
    # Convert sets to lists before returning
    events_dict = {date: list(contacts) for date, contacts in events_dict.items()}
    return events_dict

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

if __name__ == "__main__":
    handle_get_events()