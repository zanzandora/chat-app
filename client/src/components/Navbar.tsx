import { Link, useLocation } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { BellIcon, LogOutIcon, Moon } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const { authUser, isFetching } = useAuthUser();

  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');

  const { mutate: logoutMutation } = useLogout();

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end gap-2 w-full'>
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className='pl-5'>
              <Link to='/' className='flex items-center gap-2.5'>
                <Moon className='size-9 text-primary' />
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider'>
                  Chatzy
                </span>
              </Link>
            </div>
          )}

          <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
            <Link to={'/notifications'}>
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
          </div>

          {/* THEME */}
          <ThemeSelector />

          <div className='avatar'>
            {isFetching ? (
              <div className='skeleton h-9 w-9 rounded-full'></div>
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
