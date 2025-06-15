import { LoaderIcon } from 'lucide-react';
import React from 'react';

type Props = {};

const Loader = (props: Props) => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoaderIcon className=' animate-spin size-10' />
    </div>
  );
};

export default Loader;
