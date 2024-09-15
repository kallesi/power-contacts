def add_tag(plain_text: str, tag: str):
    new_text = plain_text + f"\n#{tag}"
    return new_text
def remove_tag(plain_text: str, tag: str):
    text_attributes = plain_text.split("\n")
    new_attributes = []
    for attribute in text_attributes:
        trimmed_attribute = attribute.strip()
        if not trimmed_attribute.startswith(f'#{tag}'):
            new_attributes.append(trimmed_attribute)
    new_text = "\n".join(new_attributes)
    return new_text
def update_tag(plain_text:str, old_tag: str, new_tag:str):
    text_attributes = plain_text.split("\n")
    new_attributes = []
    for attribute in text_attributes:
        trimmed_attribute = attribute.strip()
        if trimmed_attribute.startswith(f'#{old_tag}'):
            new_attributes.append(f'#{new_tag}')
        else:
            new_attributes.append(trimmed_attribute)
    new_text = "\n".join(new_attributes)
    return new_text

