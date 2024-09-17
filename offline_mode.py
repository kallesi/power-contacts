import pickle
import uuid
from utils import split_name
from contact import Contact, create_contact_object
from handle_requests import handle_get_contacts
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
                differing_contacts.append((local_contact, remote_contact))

    # Determine remote excess contacts
    for remote_id, remote_contact in remote_dict.items():
        if remote_id not in local_dict:
            remote_excess_contacts.append(remote_contact)

    return local_excess_contacts, remote_excess_contacts, differing_contacts

def merge_local_to_remote():
    local_excess_contacts, remote_excess_contacts, differing_contacts = get_sync_differences()

    # For data safety we won't actually implement bulk deleting of contacts
    contact_objects_created = []
    contacts_created = batch_create_contacts(local_excess_contacts)
    for contact_created in contacts_created['createdPeople']:
        contact_objects_created.append(create_contact_object(contact_created['person']))

    contact_objects_updated = []
    # First get the local one of the tuple (local, remote) in differing_contacts
    differing_contacts_local_version = [contact[0] for contact in differing_contacts]
    contacts_updated = batch_update_contacts(differing_contacts_local_version)
    for contact_updated in contacts_updated:
        contact_objects_updated.append(create_contact_object(contact_updated))

    return contact_objects_created, contact_objects_updated

def merge_contacts_from_remote():
    gc_objects: list[Contact] = get_contacts()
    contacts = []
    for contact in gc_objects:
        contacts.append(create_contact_object(contact))
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    return contacts

# CRUD Operations
def get_local_all():
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
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

def update_local(id: str, update_contact: Contact):
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    for i, contact in enumerate(contacts):
        if contact.id == id:
            contacts[i] = update_contact
            break
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    with open('local_contacts.pickle', mode='rb') as file:
        updated_contacts: list[Contact] = pickle.load(file)
    return updated_contacts

def create_local(name: str):
    id = uuid.uuid4().hex
    new_contact = Contact(
        id=id,
        names=name,
        phone_numbers=[],
        emails=[],
        text='locally created'
    )
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    contacts.append(new_contact)
    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    with open('local_contacts.pickle', mode='rb') as file:
        updated_contacts: list[Contact] = pickle.load(file)
    return updated_contacts

def delete_local(id: str):
    with open('local_contacts.pickle', mode='rb') as file:
        contacts: list[Contact] = pickle.load(file)
    for contact in contacts:
        if contact.id == id:
            contacts.remove(contact)
            break

    with open('local_contacts.pickle', mode='wb') as file:
        pickle.dump(contacts, file)
    with open('local_contacts.pickle', mode='rb') as file:
        updated_contacts: list[Contact] = pickle.load(file)
    return updated_contacts

if __name__ =="__main__":
    pass