import type { ISignUp } from '@/hooks/useSignUp';
import { axiosInstance } from './axios';
import type { OnboardingFormValues } from '@/pages/OnBoardingPage';
import type { ILogin } from '@/hooks/useLogin';
import { getErrorMessage } from '@/utils/getErrorMessage';

export const signup = async (signupData: ISignUp) => {
  const res = await axiosInstance.post('/auth/signup', signupData);
  return res.data;
};

export const login = async (loginData: ILogin) => {
  const res = await axiosInstance.post('/auth/login', loginData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  } catch (error) {
    console.error('Error when authorized : ', getErrorMessage(error));

    return null;
  }
};

export const completeOnboarding = async (data: OnboardingFormValues) => {
  const res = await axiosInstance.post('/auth/onboarding', data);
  return res.data;
};
