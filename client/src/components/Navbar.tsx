import { Link, useLocation } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { BellIcon, LogOutIcon, Moon, UserIcon, UsersIcon } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';
import ThemeSelector from './ThemeSelector';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRef, useState, useEffect } from 'react';

const Navbar = () => {
  const { authUser, isFetching } = useAuthUser();
  const isMobile = useIsMobile();

  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');
  const isCallPage = location.pathname?.startsWith('/call');

  const { mutate: logoutMutation } = useLogout();

  // Dropdown state for mobile avatar
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!avatarDropdownOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target as Node)
      ) {
        setAvatarDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [avatarDropdownOpen]);

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end gap-2 w-full'>
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage ||
            isCallPage ||
            (isMobile && (
              <div className='pl-5'>
                <Link to='/' className='flex items-center gap-2.5'>
                  <Moon className='lg:size-9 size-4 text-primary' />
                  <span className='lg:text-3xl text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider'>
                    Chatzy
                  </span>
                </Link>
              </div>
            ))}

          <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
            <Link to={'/notifications'}>
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
          </div>

          {/* THEME */}
          <ThemeSelector />

          {/* Avatar & Dropdown for mobile */}
          <div className='avatar' ref={avatarDropdownRef}>
            {isFetching ? (
              <div className='skeleton h-9 w-9 rounded-full'></div>
            ) : isMobile ? (
              <>
                <div
                  className='w-9 rounded-full cursor-pointer'
                  onClick={() => setAvatarDropdownOpen((prev) => !prev)}
                  tabIndex={0}
                  aria-label='User menu'
                >
                  <img src={authUser?.img} alt='User Avatar' rel='noreferrer' />
                </div>
                {avatarDropdownOpen && (
                  <div className='absolute  right-4 top-9 mt-2 w-48 bg-base-200 border border-base-content/10 shadow-2xl rounded-xl z-50'>
                    <ul className='py-2'>
                      <li>
                        <Link
                          to='/friends'
                          className='flex items-center gap-2 px-4 py-2 hover:bg-base-content/5 transition-colors'
                          onClick={() => setAvatarDropdownOpen(false)}
                        >
                          <UsersIcon className='size-4' />
                          Friends
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/notifications'
                          className='flex items-center gap-2 px-4 py-2 hover:bg-base-content/5 transition-colors'
                          onClick={() => setAvatarDropdownOpen(false)}
                        >
                          <BellIcon className='size-4' />
                          Notifications
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/profile'
                          className='flex items-center gap-2 px-4 py-2 hover:bg-base-content/5 transition-colors'
                          onClick={() => setAvatarDropdownOpen(false)}
                        >
                          <UserIcon className='size-4' />
                          Profile
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className='w-9 rounded-full'>
                <img src={authUser?.img} alt='User Avatar' rel='noreferrer' />
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            className='btn btn-ghost btn-circle'
            onClick={() => logoutMutation()}
          >
            <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
