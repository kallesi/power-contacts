from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

import sys
import threading
import webview
from http.server import SimpleHTTPRequestHandler, HTTPServer

from handle_requests import handle_get_contacts, handle_get_contact, handle_get_tags, handle_get_tag, handle_get_events, handle_get_event
from handle_requests import handle_add_tag, handle_add_event
from handle_requests import handle_update_tag, handle_update_event
from handle_requests import handle_remove_tag, handle_remove_event
app = FastAPI()

origins = [
    'http://localhost:5173'
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
    return "Success: Server is running"
@app.get("/contacts")
def get_contacts():
    """
    Returns all contacts
    """
    return handle_get_contacts()
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
                        description: str = None
    ):
    """
    Returns full details of updated contact
    """
    if old_tag and new_tag:
        return handle_update_tag(id, old_tag, new_tag)
    elif date and description:
        return handle_update_event(id, date, description)
    else:
        return {'Error': 'Please provide tag or event to update'}

@app.delete("/contact/{id}")
def delete_contact_details(id: str,
                           tag: str = None,
                           date: str = None
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
    else:
        return {'Error': 'Please provide tag or event to delete'}

@app.get("/events")
def get_events():
    """
    Returns all events, grouped by date
    """
    return handle_get_events()
@app.get("/event/{date}")
def get_events(date: str):
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


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3001)

