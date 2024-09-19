from os.path import abspath
import pickle
import uuid
import json
from contact import Contact, create_contact_object
from google_api import get_contacts, batch_create_contacts, batch_update_contacts, batch_delete_contacts

# Syncing
def get_sync_differences():
    local_objects = get_local_all()
    gc_dicts = get_contacts()
    gc_objects = [create_contact_object(contact) for contact in gc_dicts]

    local_dict = {contact.id: contact for contact in local_objects}
    remote_dict = {contact.id: contact for contact in gc_objects}

    local_excess_contacts = []
    remote_excess_contacts = []
    differing_contacts = []

    # Determine local excess contacts
    for local_id, local_contact in local_dict.items():
        if local_id not in remote_dict:
            local_excess_contacts.append(local_contact)
        else:
            remote_contact = remote_dict[local_id]
            if remote_contact != local_contact:
                differing_contacts.append(local_contact)

    # Determine remote excess contacts
    for remote_id, remote_contact in remote_dict.items():
        if remote_id not in local_dict:
            remote_excess_contacts.append(remote_contact)

    return local_excess_contacts, remote_excess_contacts, differing_contacts

def merge_local_to_remote():
    local_excess_contacts, remote_excess_contacts, differing_contacts = get_sync_differences()
    contact_objects_created = []
    if len(local_excess_contacts) > 0:
        contacts_created = batch_create_contacts(local_excess_contacts)
        for contact in contacts_created:
            contact_objects_created.append(contact)

    contact_objects_updated = []
    # First get the local one of the tuple (local, remote) in differing_contacts
    if len(differing_contacts) > 0:
        contacts_updated = batch_update_contacts(differing_contacts)
        for contact_updated in contacts_updated:
            contact_objects_updated.append(contact_updated)

    contact_objects_deleted = []
    if len(remote_excess_contacts) > 0:
        contacts_deleted = batch_delete_contacts(remote_excess_contacts)
        for contact_deleted in contacts_deleted:
            contact_objects_deleted.append(contact_deleted)

    return contact_objects_created, contact_objects_updated, contact_objects_deleted

# Get data to local - from Google or from Json file

def merge_contacts_to_local(contacts: list[Contact]):
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    return contacts
def import_json_dict_to_local(data: dict):
    contacts = []
    for contact_id, attributes in data.items():
        contact = Contact(
            id=contact_id,
            names=attributes['name'],
            phone_numbers=attributes['phoneNumbers'],
            emails=attributes['emails'],
            text="\n".join(attributes['notes'] +
                [f":{event['date']} {event['description']}" for event in attributes['events']] +
                [f"#{tag}" for tag in attributes['tags']])
        )
        contacts.append(contact)
    return merge_contacts_to_local(contacts)

def merge_remote_to_local():
    gc_objects: list[Contact] = get_contacts()
    contacts = []
    for contact in gc_objects:
        contacts.append(create_contact_object(contact))
    return merge_contacts_to_local(contacts)

# CRUD Operations
def get_local_all():
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    contacts = sorted(contacts)
    return contacts
def get_local(id: str):
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
        selected_contact = None
        for contact in contacts:
            if id == contact.id:
                selected_contact = contact
                break
    return selected_contact

def update_local(id: str, **kwargs):
    update_contact = get_local(id)

    for prop, value in kwargs.items():
        if hasattr(update_contact, prop):
            setattr(update_contact, prop, value)

    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    for i, contact in enumerate(contacts):
        if contact.id == id:
            contacts[i] = update_contact
            break
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    return update_contact

def create_local(name: str):
    id = uuid.uuid4().hex
    new_contact = Contact(
        id=id,
        names=name,
        phone_numbers=[],
        emails=[],
        text=''
    )
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    contacts.append(new_contact)
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    return new_contact

def delete_local(id: str):
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    for contact in contacts:
        if contact.id == id:
            deleted_contact = contact
            contacts.remove(contact)
            break
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    return deleted_contact


def export_local_all():
    with open('local_contacts.pickle', mode='rb') as file:
        contacts = pickle.load(file)
    data = {
        contact.id: {
            'name': contact.name,
            'phoneNumbers': contact.phoneNumbers,
            'emails': contact.emails,
            'tags': contact.tags,
            'events': [{'date': event.date, 'description': event.description} for event in contact.events],
            'notes': contact.notes
        }
        for contact in contacts
    }
    with open('file.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)
    return abspath('file.json')




if __name__ == '__main__':
    export_local_all()