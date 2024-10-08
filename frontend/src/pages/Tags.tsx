import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../constants';
import useFetch from '../hooks/useFetch';
import NavBar from '../components/NavBar';
import TagPage from '../components/TagPage';
import TagCard from '../components/TagCard';
import { TagContact } from '../commonTypes';


type Tags = {
  [tag: string]: TagContact[];
};

function Tags() {
  const { data: tags } = useFetch<Tags>(`${BACKEND_URL}/tags`, 'GET');
  const [localTags, setLocalTags] = useState<Tags>({});
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<{ tag: string; contacts: TagContact[] } | null>(null);

  useEffect(() => {
    setLocalTags(tags || {});
  }, [tags]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setLocalTags(tags || {});
    } else {
      const searchTerms = searchText.toLowerCase().split(',').map(term => term.trim());

      const filteredTags = Object.entries(tags || {}).reduce((acc, [tag, contacts]) => {
        if (searchTerms.some(term => tag.toLowerCase().includes(term))) {
          acc[tag] = contacts;
        }
        return acc;
      }, {} as Tags);

      const filteredContacts: TagContact[] = [];
      const uniqueContacts = new Set<string>();

      Object.entries(filteredTags).forEach(([, contacts]) => {
        contacts.forEach(contact => {
          if (!uniqueContacts.has(contact.id)) {
            const contactTags = Object.entries(tags || {}).filter(([, c]) => c.some(ct => ct.id === contact.id));
            const contactMatchesAll = searchTerms.every(term =>
              contactTags.some(([t]) => t.toLowerCase().includes(term))
            );

            if (contactMatchesAll) {
              filteredContacts.push(contact);
              uniqueContacts.add(contact.id);
            }
          }
        });
      });

      const finalTags = Object.entries(filteredTags).reduce((acc, [tag, contacts]) => {
        const matchingContacts = contacts.filter(contact => uniqueContacts.has(contact.id));
        if (matchingContacts.length > 0) {
          acc[tag] = matchingContacts;
        }
        return acc;
      }, {} as Tags);

      setLocalTags(finalTags);
    }
  }, [searchText, tags]);

  const handleTagClick = (tag: string, contacts: TagContact[]) => {
    setSelectedTag({ tag, contacts });
  };

  const handleCloseOverlay = () => {
    setSelectedTag(null);
  };

  return (
    <div>
      <div className='fixed top-0 left-0 w-full z-10'>
        <NavBar
          searchText={searchText}
          setSearchText={setSearchText}
          showSearch={true}
        />
      </div>
      <div className='mt-20 p-5 grid md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-2'>
        {Object.entries(localTags).map(([tag, contacts]) => (
          <TagCard
            key={tag}
            people={contacts}
            tag={tag}
            onClick={() => handleTagClick(tag, contacts)}
          />
        ))}
      </div>
      {selectedTag && (
        <TagPage
          tag={selectedTag.tag}
          contacts={selectedTag.contacts}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}

export default Tags;