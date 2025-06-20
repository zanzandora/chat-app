import { useLogin } from '@/hooks/useLogin';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Moon } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginData);
  };
  return (
    <div
      className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8'
      data-theme='dracula'
    >
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* LOGIN FORM - LEFT SIDE */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* LOGO */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <Moon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              Chatzy
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className='alert text-black alert-error mb-4'>
              <span>{getErrorMessage(error)}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Welcome back</h2>
                  <p className='text-sm opacity-70'>
                    sign in to your account to continue youe language learning
                  </p>
                </div>

                <div className='space-y-3'>
                  {/* EMAIL */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type='email'
                      placeholder='john@gmail.com'
                      className='input input-bordered w-full'
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type='password'
                      placeholder='********'
                      className='input input-bordered w-full'
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Loading...
                    </>
                  ) : (
                    'Login Now'
                  )}
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Don't have an account?{' '}
                    <Link to='/signup' className='text-primary hover:underline'>
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* LOGIN FORM - RIGHT SIDE */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            {/* Illustration */}
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img
                src='/i.svg'
                alt='Language connection illustration'
                className='w-full h-full'
              />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>
                Connect with language partners worldwide
              </h2>
              <p className='opacity-70'>
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
