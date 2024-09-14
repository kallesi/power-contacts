def split_name(full_name):
    names = full_name.split()

    if len(names) > 1:
        given_name = ' '.join(names[:-1])
        family_name = names[-1]
    else:
        given_name = names[0]
        family_name = ""

    return given_name, family_name
