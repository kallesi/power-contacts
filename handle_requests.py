from event import add_event, remove_event, update_event, Event
from google_api import get_contact, get_contacts, get_plain_text, update_contact_plain_text
from google_api import delete_contact, create_contact, rename_contact
from google_api import update_contact_phones_emails
from offline_api import get_local_all, get_local, update_local, delete_local, create_local
from offline_api import merge_local_to_remote, merge_remote_to_local, get_sync_differences
from offline_api import import_json_dict_to_local, export_local_all
from contact import Contact, create_contact_object
from collections import defaultdict
from tag import add_tag, remove_tag, update_tag
from utils import is_email, ContactAttr
from datetime import datetime


def handle_get_contacts():
    try:
        contact_objects: list = get_local_all()
    except:
        contact_objects = []
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
    contact: Contact = get_local(id)
    return contact

def handle_add_tag(id: str, tag: str):
    contact: Contact = get_local(id)
    tags: list = contact.tags
    if not tag in tags:
        tags.append(tag)
    new_contact = update_local(id, tags=tags)
    return new_contact

def handle_remove_tag(id: str, tag: str):
    contact = get_local(id)
    tags: list = contact.tags
    tags.remove(tag)
    new_contact = update_local(id, tags=tags)
    return new_contact

def handle_update_tag(id: str, old_tag: str, new_tag: str):
    contact = get_local(id)
    tags = contact.tags
    for i, tag in enumerate(tags):
        if tag == old_tag:
            tags[i] = new_tag
    new_contact = update_local(id, tags=tags)
    return new_contact

def handle_add_event(id: str, date: str, description: str):
    contact = get_local(id)
    events: list = contact.events
    events.append(Event(date, description))
    new_contact = update_local(id, events=events)
    return new_contact

def handle_remove_event(id: str, date: str):
    contact = get_local(id)
    events: list = contact.events
    new_events = []
    for event in events:
        if event.date != date:
            new_events.append(event)
    new_contact = update_local(id, events=new_events)
    return new_contact

def handle_update_event(id: str, date: str, description: str):
    contact = get_local(id)
    events = contact.events
    for event in events:
        if event.date == date:
            event.description = description
    new_contact = update_local(id, events=events)
    return new_contact


def handle_update_notes(id: str, notes: str):
    note_strings = notes.split('\n')
    new_contact = update_local(id, notes=note_strings)
    return new_contact

def handle_create_contact(name: str):
    return create_local(name)

def handle_delete_contact(id: str):
    return delete_local(id)

def handle_rename_contact(id: str, name: str):
    return update_local(id, name=name)

def handle_update_phones_emails(id: str, phones_emails: str):
    phones_emails_list = phones_emails.split('\n')
    phones_list = []
    emails_list = []
    for item in phones_emails_list:
        if is_email(item) == ContactAttr.EMAIL:
            emails_list.append(item)
        elif is_email(item) == ContactAttr.PHONE:
            phones_list.append(item)
    if len(phones_list) == 0:
        phones_list = None
    if len(emails_list) == 0:
        emails_list = None
    return update_local(id, phone_numbers=phones_list, emails=emails_list)

# Handle Syncing

def handle_get_sync_differences():
    try:
        get_local_all()
    except:
        return {
            'localExcessContacts': [],
            'remoteExcessContacts': [],
            'updatedContacts': []
        }
    local_excess, remote_excess, updated = get_sync_differences()
    return {
        'localExcessContacts': local_excess,
        'remoteExcessContacts': remote_excess,
        'updatedContacts': updated
    }

def handle_merge_to_local():
    merge_remote_to_local()
    local_excess, remote_excess, updated = get_sync_differences()
    return {
        'localExcessContacts': local_excess,
        'remoteExcessContacts': remote_excess,
        'updatedContacts': updated
    }

def handle_merge_to_remote():
    merge_local_to_remote()
    local_excess, remote_excess, updated = get_sync_differences()
    return {
        'localExcessContacts': local_excess,
        'remoteExcessContacts': remote_excess,
        'updatedContacts': updated
    }

# Import export

def handle_import(data: dict) -> list[Contact]:
    return import_json_dict_to_local(data)

def handle_export() -> str:
    """
    returns absolute path of the json file
    """
    return export_local_all()