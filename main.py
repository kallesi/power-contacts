from threading import Thread, Event
from enum import Enum
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import webview
from handle_requests import handle_get_contacts, handle_get_contact, handle_get_tags, handle_get_tag, handle_get_events, handle_get_event
from handle_requests import handle_add_tag, handle_add_event
from handle_requests import handle_update_tag, handle_update_event, handle_update_notes
from handle_requests import handle_remove_tag, handle_remove_event
from handle_requests import handle_delete_contact, handle_create_contact, handle_rename_contact
from handle_requests import handle_update_phones_emails

class RunMode(Enum):
    DEV = 0
    PROD = 1

STATIC_DIR = "static"
FASTAPI_PORT = 3001
app = FastAPI()
origins = [
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    'http://localhost:5173',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return 'Server is online'

@app.get("/contacts")
def get_contacts():
    """
    Returns all contacts
    """
    return handle_get_contacts()

@app.post("/contact/create")
def create_contact(name: str):
    """
    Creates a new contact
    """
    return handle_create_contact(name)

@app.get("/contact/{id}")
def get_contact(id: str):
    """
    Returns full details of matched contact
    """
    return handle_get_contact(id)
@app.post("/contact/{id}")
def post_contact_details(id: str,
                         tag: str = None,
                         date: str = None,
                         description: str = None
    ):
    """
    Returns full details of updated contact
    """
    if tag:
        return handle_add_tag(id, tag)
    elif date and description:
        return handle_add_event(id, date, description)
    else:
        return {'Error': 'Please provide tag or event to add'}

@app.put("/contact/{id}")
def put_contact_details(id: str,
                        old_tag: str = None,
                        new_tag: str = None,
                        date: str = None,
                        description: str = None,
                        rename_new_name: str = None,
                        notes: str = None,
                        phone_email_multiline: str = None
    ):
    """
    Returns full details of updated contact
    """
    if old_tag and new_tag:
        return handle_update_tag(id, old_tag, new_tag)
    elif date and description:
        return handle_update_event(id, date, description)
    elif rename_new_name:
        return handle_rename_contact(id, rename_new_name)
    elif notes != None:
        return handle_update_notes(id, notes)
    elif phone_email_multiline != None:
        return handle_update_phones_emails(id, phone_email_multiline)
    else:
        return {'Error': 'Please provide tag or event to update'}

@app.delete("/contact/{id}")
def delete_contact_details(id: str,
                           tag: str = None,
                           date: str = None,
                           delete_contact: bool = False
    ):
    """
    Returns full details of updated contact
    For date, note that it will delete any events associated with this date prefix.
    If you provide "2024-01" it will delete any events in 2024 January, etc.
    """
    if tag:
        return handle_remove_tag(id, tag)
    elif date:
        return handle_remove_event(id, date)
    elif delete_contact:
        return handle_delete_contact(id)
    else:
        return {'Error': 'Please provide tag or event to delete'}

@app.get("/events")
def get_events():
    """
    Returns all events, grouped by date
    """
    return handle_get_events()
@app.get("/event/{date}")
def get_event(date: str):
    """
    Returns all events matching the date query
    """
    return handle_get_event(date)
@app.get("/tags")
def get_tags():
    """
    Returns all tags and contacts tagged with each event
    """
    return handle_get_tags()
@app.get("/tag/{tag}")
def get_tag(tag: str):
    """
    Returns all tags starting with the phrase
    """
    return handle_get_tag(tag)


stop_event = Event()
def run_fastapi_server():
    while not stop_event.is_set():
        uvicorn.run(app, host="127.0.0.1", port=FASTAPI_PORT)

if __name__ == "__main__":
    mode = RunMode.PROD
    if mode == RunMode.PROD:  # Mount the static files only in production mode
        app.mount("/app", StaticFiles(directory=STATIC_DIR, html=True), name="app")
    t = Thread(target=run_fastapi_server)
    t.daemon = True
    t.start()
    if mode == RunMode.PROD:  # Launch the window only in production mode
        webview.create_window(
            title='Power Contacts',
            url=f'http://localhost:{FASTAPI_PORT}/app/',
            height=960,
            width=1280,
            min_size=(1280, 960),  # Set the minimum size
            resizable=True
        )
        webview.start()
        stop_event.set()  # Set stop_event after launching the window in production mode
    else:
        try:
            while True:
                pass  # Keep the main thread running in development mode
        except KeyboardInterrupt:
            stop_event.set()  # Set stop_event if KeyboardInterrupt occurs in development mode