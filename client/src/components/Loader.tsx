import { useThemeStore } from '@/store/useThemeStore';
import { LoaderIcon } from 'lucide-react';

const Loader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className='min-h-screen flex items-center justify-center'
      data-theme={theme}
    >
      <LoaderIcon className=' animate-spin size-10' />
    </div>
  );
};

export default Loader;
