import { Link } from 'react-router-dom';

type NavBarProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  showSearch: boolean;
};

function NavBar({ searchText, setSearchText, showSearch = true }: NavBarProps) {
  return (
    <div className='navbar bg-primary'>
      <div className='flex-1'>
        <Link
          to='/app/'
          className='btn btn-ghost text-xl font-bold text-primary-content'
        >
          Power Contacts
        </Link>
        <Link
          to='/app/tags/'
          className='btn btn-ghost text-xl font-normal text-primary-content'
        >
          Tags
        </Link>
        <Link
          to='/app/events/'
          className='btn btn-ghost text-xl font-normal text-primary-content'
        >
          Events
        </Link>
      </div>
      {showSearch && (
        <div className='flex-row gap-2'>
          <input
            type='text'
            placeholder='Search'
            className='input input-bordered w-24 md:w-auto'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default NavBar;