from google_api import get_contact, get_contacts, get_plain_text, update_contact_plain_text
from contact import Contact, create_contact_object
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

