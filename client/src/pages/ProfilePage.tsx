import { LANGUAGES } from '@/constants';
import useAuthUser from '@/hooks/useAuthUser';
import { updateProfile } from '@/libs/api';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CameraIcon,
  KeyRound,
  LoaderIcon,
  MapPinIcon,
  Moon,
  ShuffleIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const profileSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  fullname: z.string().min(1, 'Full name is required'),
  bio: z.string().min(1, 'Bio is required'),
  nativeLanguage: z.string().min(1, 'Native language is required'),
  learningLanguage: z.string().min(1, 'Learning language is required'),
  location: z.string().min(1, 'Location is required'),
  img: z.string().url('Profile picture must be a valid URL'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: authUser?.email || '',
      fullname: authUser?.fullname || '',
      bio: authUser?.bio || '',
      nativeLanguage: authUser?.nativeLanguage?.toLowerCase() || '',
      learningLanguage: authUser?.learningLanguage?.toLowerCase() || '',
      location: authUser?.location || '',
      img: authUser?.img || '',
    },
  });

  const img = watch('img');

  const { mutate: updateProfileMution, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      reset(getValues());
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Profile onboarded successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Update profile failed');
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMution(data);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${idx}&radius=50`;
    setValue('img', randomAvatar, { shouldValidate: true, shouldDirty: true });
    toast.success('Random profile picture generated!');
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center py-4  '>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl border border-primary/25'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
            Your Profile
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* PROFILE PIC CONTAINER */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              {/* IMAGE PREVIEW */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {img ? (
                  <img
                    src={img}
                    alt='Profile Preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>
              <input type='hidden' {...register('img')} />

              {/* Generate Random Avatar BTN */}
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={handleRandomAvatar}
                  className='btn btn-accent'
                >
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>
              {errors.img && (
                <span className='text-error text-sm'>{errors.img.message}</span>
              )}
            </div>

            <h2 className='text-lg sm:text-xl font-light tracking-wider '>
              ACCOUNT
            </h2>

            {/* EMAIL */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                {...register('email')}
                className='input input-bordered input-disabled w-full'
                placeholder='Your email'
                readOnly
              />
              {errors.fullname && (
                <span className='text-error text-sm'>
                  {errors.fullname.message}
                </span>
              )}
            </div>
            {/* PASSWORD */}
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={handleRandomAvatar}
                className='btn btn-accent'
              >
                <KeyRound className='size-4 mr-2' />
                Change Password
              </button>
            </div>

            <h2 className='text-lg sm:text-xl font-light tracking-wider '>
              OVERVIEW
            </h2>
            {/* FULL NAME */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input
                type='text'
                {...register('fullname')}
                className='input input-bordered w-full'
                placeholder='Your full name'
              />
              {errors.fullname && (
                <span className='text-error text-sm'>
                  {errors.fullname.message}
                </span>
              )}
            </div>

            {/* BIO */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea
                {...register('bio')}
                className='textarea textarea-bordered h-24'
                placeholder='Tell others about yourself and your language learning goals'
              />
              {errors.bio && (
                <span className='text-error text-sm'>{errors.bio.message}</span>
              )}
            </div>

            {/* LANGUAGES */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* NATIVE LANGUAGE */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select
                  {...register('nativeLanguage')}
                  className='select select-bordered w-full '
                >
                  <option value=''>Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors.nativeLanguage && (
                  <span className='text-error text-sm'>
                    {errors.nativeLanguage.message}
                  </span>
                )}
              </div>

              {/* LEARNING LANGUAGE */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select
                  {...register('learningLanguage')}
                  className='select select-bordered w-full'
                >
                  <option value=''>Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors.learningLanguage && (
                  <span className='text-error text-sm'>
                    {errors.learningLanguage.message}
                  </span>
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Location</span>
              </label>
              <div className='relative'>
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70' />
                <input
                  type='text'
                  {...register('location')}
                  className='input input-bordered w-full pl-10'
                  placeholder='City, Country'
                />
              </div>
              {errors.location && (
                <span className='text-error text-sm'>
                  {errors.location.message}
                </span>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className='btn btn-primary w-full'
              disabled={isPending || isSubmitting || !isDirty}
              type='submit'
            >
              {!isPending && !isSubmitting ? (
                <>
                  <Moon className='size-5 mr-2' />
                  Update Profile
                </>
              ) : (
                <>
                  <LoaderIcon className='animate-spin size-5 mr-2' />
                  Updating...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
