from datetime import datetime
class Event:
    def __init__(self, date: str, description: str):
        self.date = date
        self.description = description

    def __eq__(self, other):
        if not isinstance(other, Event):
            return False
        return self.__dict__ == other.__dict__
    def __repr__(self):
        return f'[{self.date}] {self.description}'
    def __str__(self):
        return f'[{self.date}] {self.description}'

def add_event(plain_text: str, date: str, description: str):
    new_text = plain_text + f"\n:{date} {description}"
    return new_text
def remove_event(plain_text: str, date: str):
    text_attributes = plain_text.split("\n")
    new_attributes = []
    for attribute in text_attributes:
        trimmed_attribute = attribute.strip()
        if not trimmed_attribute.startswith(f':{date}'):
            new_attributes.append(trimmed_attribute)
    new_text = "\n".join(new_attributes)
    return new_text
def update_event(plain_text:str, date: str, description:str):
    text_attributes = plain_text.split("\n")
    new_attributes = []
    for attribute in text_attributes:
        trimmed_attribute = attribute.strip()
        if trimmed_attribute.startswith(f':{date}'):
            new_attributes.append(f':{date} {description}')
        else:
            new_attributes.append(trimmed_attribute)
    new_text = "\n".join(new_attributes)
    return new_text