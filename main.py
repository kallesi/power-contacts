import os
from threading import Thread, Event
from enum import Enum
from utils import get_error_dict
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
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
from handle_requests import handle_get_sync_differences, handle_merge_to_local, handle_merge_to_remote, handle_delete_token
from handle_requests import handle_import, handle_export


class RunMode(Enum):
    DEV = 0
    PROD = 1

# Handle static files
STATIC_DIR = "static"
class SPAStaticFiles(StaticFiles):
    """
    Custom StaticFiles class to serve index.html for any unmatched routes.
    This ensures that frontend routing is handled by React Router.
    """
    async def get_response(self, path: str, scope):
        print('Get response is run')
        # Attempt to get the static file response
        try:
            print('Trying what parent class does')
            response = await super().get_response(path, scope)
            return response
        except:
            print('Got 404, Triggered specific action')
            # Serve the index.html file
            index_file_path = os.path.join(self.directory, "index.html")
            return FileResponse(index_file_path)

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
    try:
        return handle_get_contacts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

@app.post("/contact/create")
def create_contact(name: str):
    """
    Creates a new contact
    """
    try:
        return handle_create_contact(name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

@app.get("/contact/{id}")
def get_contact(id: str):
    """
    Returns full details of matched contact
    """
    try:
        return handle_get_contact(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))
@app.post("/contact/{id}")
def post_contact_details(id: str,
                         tag: str = None,
                         date: str = None,
                         description: str = None
    ):
    """
    Returns full details of updated contact
    """
    try:
        if tag:
            return handle_add_tag(id, tag)
        elif date and description:
            return handle_add_event(id, date, description)
        else:
            return {'Error': 'Please provide tag or event to add'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

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
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

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
    try:
        if tag:
            return handle_remove_tag(id, tag)
        elif date:
            return handle_remove_event(id, date)
        elif delete_contact:
            return handle_delete_contact(id)
        else:
            return {'Error': 'Please provide tag or event to delete'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))
@app.get("/events")
def get_events():
    """
    Returns all events, grouped by date
    """
    try:
        return handle_get_events()
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

@app.get("/event/{date}")
def get_event(date: str):
    """
    Returns all events matching the date query
    """
    try:
        return handle_get_event(date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))
@app.get("/tags")
def get_tags():
    """
    Returns all tags and contacts tagged with each event
    """
    try:
        return handle_get_tags()
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))
@app.get("/tag/{tag}")
def get_tag(tag: str):
    """
    Returns all tags starting with the phrase
    """
    try:
        return handle_get_tag(tag)
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

# Handle Synchronisation

@app.get("/sync")
def get_sync_differences():
    try:
        return handle_get_sync_differences()
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

@app.put("/sync/pull")
def sync_pull():
    try:
        return handle_merge_to_local()
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

@app.put("/sync/push")
def sync_push():
    try:
        changes = handle_merge_to_remote()
        return changes
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

@app.put("/sync/reset")
def reset_credentials():
    try:
        return handle_delete_token()
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))

# Import export
@app.post("/upload")
async def upload_contacts(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        data = json.loads(contents)
        contacts = handle_import(data)
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))
@app.get("/download")
async def download_contacts():
    try:
        file_path = handle_export()
        return FileResponse(file_path, media_type='application/json', filename='contacts.json')
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_error_dict(e))




if __name__ == "__main__":
    mode = RunMode.PROD
    if mode == RunMode.PROD:
        app.mount("/app", SPAStaticFiles(directory=STATIC_DIR, html=True), name="app")
    stop_event = Event()
    def run_fastapi_server():
        while not stop_event.is_set():
            uvicorn.run(app, host="127.0.0.1", port=FASTAPI_PORT)
    t = Thread(target=run_fastapi_server)
    t.daemon = True
    t.start()
    if mode == RunMode.PROD:
        webview.create_window(
            title='Power Contacts',
            url=f'http://localhost:{FASTAPI_PORT}/app/',
            height=960,
            width=1280,
            min_size=(1280, 960),
            resizable=True
        )
        webview.settings['ALLOW_DOWNLOADS'] = True
        webview.start()
        stop_event.set()
    else:
        try:
            while True:
                pass  # Keep the main thread running in development mode
        except KeyboardInterrupt:
            stop_event.set()