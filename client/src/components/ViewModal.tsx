import type { IUser } from '@/types';
import { getLanguageFlag } from '@/utils/getLanguageFlag';
import { Locate, Mail } from 'lucide-react';
import React, { useRef, useCallback } from 'react';

type Props = {
  friend: Omit<IUser, 'password'>;
};

const ViewModal: React.FC<Props> = ({ friend }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = useCallback(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  const closeDialog = useCallback(() => {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, []);

  return (
    <>
      <button className='btn btn-outline w-full' onClick={openDialog}>
        View Profile
      </button>
      <dialog className='modal' ref={dialogRef}>
        <div className='modal-box relative'>
          <button
            className='btn btn-sm btn-circle absolute right-2 top-2'
            onClick={closeDialog}
            aria-label='Close'
          >
            ✕
          </button>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-6 p-4'>
            <div className='avatar shadow-lg'>
              <div className='w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform hover:scale-105'>
                <img src={friend.img} alt={friend.fullname} />
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-2'>
              <h2 className='text-2xl md:text-3xl font-bold '>
                {friend.fullname}
              </h2>
              {friend.email && (
                <div className='flex items-center text-sm gap-2 '>
                  <Mail className='w-4 h-4' />
                  <span>{friend.email}</span>
                </div>
              )}
              {friend.bio && (
                <p className='my-2 text-base-content/80 italic'>{friend.bio}</p>
              )}
              {friend.location && (
                <div className='flex items-center text-sm gap-2'>
                  <Locate className='w-4 h-4' />
                  <span>{friend.location}</span>
                </div>
              )}
              <div className='flex flex-wrap gap-2 mt-2'>
                <span className='badge badge-secondary text-sm px-3 py-2 hover:brightness-110 transition'>
                  {getLanguageFlag(friend.nativeLanguage)}
                  <span className='ml-1'>Native: {friend.nativeLanguage}</span>
                </span>
                <span className='badge badge-outline text-sm px-3 py-2 hover:bg-primary/10 transition'>
                  {getLanguageFlag(friend.learningLanguage)}
                  <span className='ml-1'>
                    Learning: {friend.learningLanguage}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ViewModal;
