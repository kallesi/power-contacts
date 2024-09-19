from contact import Contact
import utils
from google_auth import get_service
from contact import create_contact_object

def get_contacts(page_size: int = 1000) -> list[dict]:
    service = get_service()
    # First load
    results = (
        service
        .people()
        .connections()
        .list(
            resourceName='people/me',
            personFields='names,biographies,emailAddresses,phoneNumbers',
            sortOrder='FIRST_NAME_ASCENDING',
            pageSize=page_size
        )
        .execute()
    )
    total_items = results.get('totalItems', '')
    page_token = results.get('nextPageToken', '')
    connections = results.get('connections', [])
    # See if page size already exceeds total items
    if total_items > page_size:
        while len(connections) < total_items:
            results = (
                service
                .people()
                .connections()
                .list(
                    resourceName='people/me',
                    personFields='names,biographies,emailAddresses,phoneNumbers',
                    sortOrder='FIRST_NAME_ASCENDING',
                    pageSize=page_size,
                    pageToken=page_token
                )
                .execute()
            )
            print('Got another page, token: ' + page_token)
            page_token = results.get('nextPageToken', '')
            connections.extend(results.get('connections', []))
    return connections


def get_contact(id: str) -> dict:
    service = get_service()
    resource_name: str = f'people/{id}'
    target_contact = service.people().get(
        resourceName=resource_name,
        personFields='names,biographies,emailAddresses,phoneNumbers'
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
    try:
        target_contact['biographies'][0]['value'] = plain_text
    except:
        # insert a new entry into biographies
        list = [{'value': plain_text}]
        target_contact['biographies'] = list
    updated_contact = service.people().updateContact(
        resourceName=resource_name,
        body=target_contact,
        updatePersonFields='biographies',
    ).execute()
    return updated_contact

def rename_contact(id: str, name: str):
    given_name, family_name = utils.split_name(name)
    service = get_service()
    resource_name: str = f'people/{id}'
    target_contact = service.people().get(
        resourceName=resource_name,
        personFields='names'
    ).execute()
    target_contact['names'][0]['givenName'] = given_name
    target_contact['names'][0]['familyName'] = family_name
    target_contact['names'][0]['displayName'] = name
    target_contact['names'][0]['unstructuredName'] = name
    updated_contact = service.people().updateContact(
        resourceName=resource_name,
        updatePersonFields='names',
        body=target_contact
    ).execute()
    return updated_contact

def delete_contact(id: str):
    service = get_service()
    resource_name: str = f'people/{id}'
    deleted_contact = service.people().deleteContact(
        resourceName=resource_name,
    ).execute()
    return deleted_contact

def create_contact(name: str):
    given_name, family_name = utils.split_name(name)
    service = get_service()
    body = {
        "names": [
            {
                "givenName": given_name,
                "familyName": family_name
            }
        ]
    }
    added_contact = service.people().createContact(
        personFields='names',
        body=body
    ).execute()
    return added_contact

def update_contact_phones_emails(id: str,
                         phone_numbers: list[str] = None,
                         emails: list[str] = None,
                         ) -> dict :
    service = get_service()
    resource_name: str = f'people/{id}'
    target_contact = service.people().get(
        resourceName=resource_name,
        personFields='phoneNumbers,emailAddresses'
    ).execute()

    if phone_numbers != None:
        phone_numbers_dict_list = []
        for number in phone_numbers:
            phone_numbers_dict_list.append({
                'value': number
            })
        target_contact['phoneNumbers'] = phone_numbers_dict_list

    if emails != None:
        emails_dict_list = []
        for email in emails:
            emails_dict_list.append({
                'value': email
            })
        target_contact['emailAddresses'] = emails_dict_list

    updated_contact = service.people().updateContact(
        resourceName=resource_name,
        updatePersonFields='phoneNumbers,emailAddresses',
        body=target_contact
    ).execute()
    return updated_contact

def create_google_contact_object(contact: Contact):
    given_name, family_name = utils.split_name(contact.name)
    names = [{
        "givenName": given_name,
        "familyName": family_name
    }]
    biographies = [{'value': contact.get_sorted_plain_text()}]
    phone_numbers = [{'value': number} for number in contact.phoneNumbers]
    emails = [{'value': email} for email in contact.emails]
    body = {
        "names": names,
        "biographies": biographies,
        "phoneNumbers": phone_numbers,
        "emailAddresses": emails,
    }
    return contact.id, body

def batch_update_contacts(contacts: list[Contact]):
    service = get_service()
    target_contacts = service.people().getBatchGet(
        personFields="names,biographies,phoneNumbers,emailAddresses",
        resourceNames=[f"people/{contact.id}" for contact in contacts]
    ).execute()
    response_contact_list = []
    for response in target_contacts['responses']:
        response_contact_list.append(response['person'])
    gc_contacts = {}
    for contact in contacts:
        id, gc_object = create_google_contact_object(contact)
        # Find etag
        for person in response_contact_list:
            if f"people/{id}" == person['resourceName']:
                gc_object['etag'] = person['etag']
        gc_contacts[f"people/{id}"] = gc_object
    body = {
        "contacts": gc_contacts,
        "updateMask": 'names,biographies,phoneNumbers,emailAddresses',
        "readMask": 'names,biographies,phoneNumbers,emailAddresses',
    }
    response_contacts = service.people().batchUpdateContacts(
        body=body
    ).execute()
    updated_contacts_list = []
    for key, val in response_contacts['updateResult'].items():
        updated_contacts_list.append(create_contact_object(val['person']))
    return updated_contacts_list


def batch_create_contacts(contacts: list[Contact]):
    service = get_service()
    gc_contacts = []
    for contact in contacts:
        id, gc_object = create_google_contact_object(contact)
        gc_contacts.append({"contactPerson": gc_object})
    body = {
        "contacts": gc_contacts,
        "readMask": 'names,biographies,phoneNumbers,emailAddresses',
    }
    response_contacts = service.people().batchCreateContacts(
        body=body,
    ).execute()
    created_contact_list = []
    for response in response_contacts['createdPeople']:
        created_contact_list.append(create_contact_object(response['person']))
    return created_contact_list

def batch_delete_contacts(contacts: list[Contact]):
    service = get_service()
    resource_name_list = [f"people/{contact.id}" for contact in contacts]
    body = {
        "resourceNames": resource_name_list
    }
    response = service.people().batchDeleteContacts(
        body=body
    ).execute()
    if response == {}:
        return contacts


if __name__ == "__main__":
    aaron1 = Contact('', 'AAron 1', [], [], '')
    aaron2 = Contact('', 'AAron 2', [], [], '')
    aaron3 = Contact('', 'AAron 3', [], [], '')


    a = batch_create_contacts([aaron1, aaron2, aaron3])

    print('done')

