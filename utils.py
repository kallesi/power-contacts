import traceback
from enum import Enum

def split_name(full_name):
    names = full_name.split()

    if len(names) > 1:
        given_name = ' '.join(names[:-1])
        family_name = names[-1]
    else:
        given_name = names[0]
        family_name = ""

    return given_name, family_name


class ContactAttr(int, Enum):
    UNKNOWN = -1
    PHONE = 0
    EMAIL = 1

def is_email(email_or_phone: str):
    if '@' in email_or_phone:
        return ContactAttr.EMAIL
    elif email_or_phone.startswith(('+', *'0123456789')):
        return ContactAttr.PHONE
    else:
        return ContactAttr.UNKNOWN

def get_error_dict(e: Exception):
    error_info = {
        'type': str(type(e).__name__),
        'message': str(e),
        'traceback': traceback.format_tb(e.__traceback__)
    }
    return error_info
