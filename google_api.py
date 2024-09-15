from google_auth import get_service

def get_contacts(page_size: int = 1000) -> list[dict]:
    service = get_service()
    # First load
    results = (
        service
        .people()
        .connections()
        .list(
            resourceName='people/me',
            personFields='names,biographies,emailAddresses,addresses',
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
                    personFields='names,biographies,emailAddresses,addresses',
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

if __name__ == "__main__":
    get_contacts_paginated()