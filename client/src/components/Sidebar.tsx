import useAuthUser from '@/hooks/useAuthUser';
import { BellIcon, HomeIcon, Moon, User, UsersIcon } from 'lucide-react';
import { Link } from 'react-router';

const getMenuItems = () => [
  {
    items: [
      {
        icon: HomeIcon,
        label: 'Home',
        href: `/`,
      },
      {
        icon: UsersIcon,
        label: 'Friends',
        href: `/friends`,
      },
      {
        icon: BellIcon,
        label: 'Notifications',
        href: `/notifications`,
      },
      {
        icon: User,
        label: 'My Profile',
        href: `/profile`,
      },
    ],
  },
];
const Sidebar = () => {
  const { authUser } = useAuthUser();

  const menuItems = getMenuItems();
  const currentPath = location.pathname;

  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0'>
      <div className='p-5 border-b border-base-300'>
        <Link to='/' className='flex items-center gap-2.5'>
          <Moon className='size-9 text-primary' />
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider'>
            Chatzy
          </span>
        </Link>
      </div>

      <nav className='flex-1 p-4 space-y-1'>
        {menuItems.map((section, idx) => (
          <div key={idx} className=''>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`btn btn-ghost justify-start w-full my-2 px-2 normal-case  ${
                    currentPath === item.href ? 'btn-active' : ''
                  }`}
                >
                  <Icon className='size-5 text-base-content opacity-70' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className='p-4 border-t border-base-300 mt-auto'>
        <div className='flex items-center gap-3'>
          <div className='avatar'>
            <div className='w-10 rounded-full'>
              <img src={authUser?.img} alt='User Avatar' />
            </div>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-sm'>{authUser?.fullname}</p>
            <p className='text-xs text-success flex items-center gap-1'>
              <span className='size-2 rounded-full bg-success inline-block' />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
