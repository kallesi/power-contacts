from event import add_event, remove_event, update_event
from google_api import get_contact, get_contacts, get_plain_text, update_contact_plain_text
from contact import Contact, create_contact_object
from collections import defaultdict
from tag import add_tag, remove_tag, update_tag

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
    return tags_dict

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
                    'eventDate': event.date,
                    'eventDescription': event.description
                })
    return events_dict

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

if __name__ == "__main__":
    handle_get_tag('hb')