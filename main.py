from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn

from handle_requests import handle_get_contacts, handle_get_contact, handle_get_tags, handle_get_events

app = FastAPI()

@app.get("/")
def read_root():
    return "Success: Server is running"

@app.get("/contacts/{id}")
def get_contact(id: str):
    return handle_get_contact(id)

@app.get("/contacts")
def get_contacts():
    return handle_get_contacts()

@app.get("/events")
def get_events():
    return handle_get_events()



app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3001)

