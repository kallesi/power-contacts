from google_auth import get_service
from contact import Contact, create_contact_object, ContactField
from utils import split_name
def get_contacts() -> list[dict]:
    service = get_service()
    results = (
        service
        .people()
        .connections()
        .list(
            resourceName='people/me',
            personFields='names,biographies,emailAddresses,addresses',
            sortOrder='FIRST_NAME_ASCENDING'
        )
        .execute()
    )
    connections = results.get('connections', [])
    all_contacts = []
    for connection in connections:
        all_contacts.append(connection)
    return all_contacts

def get_contact(id: str) -> dict:
    service = get_service()
    resource_name: str = f'people/{id}'
    target_contact = service.people().get(
        resourceName=resource_name,
        personFields='names,biographies,emailAddresses,addresses'
    ).execute()
    return target_contact

def get_plain_text(id: str) -> str:
    contact: dict = get_contact(id)
    biographies: str = contact.get('biographies', '')
    if not biographies == '':
        plain_text = biographies[0].get('value', '')
        return plain_text
    else:
        return ''

def update_contact_plain_text(id: str, plain_text: str) -> dict:
    service = get_service()
    resource_name: str = f'people/{id}'
    target_contact = service.people().get(
        resourceName=resource_name,
        personFields='names,biographies'
    ).execute()
    target_contact['biographies'][0]['value'] = plain_text
    updated_contact = service.people().updateContact(
        resourceName=resource_name,
        body=target_contact,
        updatePersonFields='biographies',
    ).execute()
    return updated_contact

