import type { ISignUp } from '@/hooks/useSignUp';
import { axiosInstance } from './axios';
import type { OnboardingFormValues } from '@/pages/OnBoardingPage';
import type { ILogin } from '@/hooks/useLogin';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { IFriendReqExtend } from '@/types';

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

export const getUserFriends = async () => {
  const res = await axiosInstance.get('/users/friends');
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data;
};

export const getOutGoingFriednReqs = async () => {
  const res = await axiosInstance.get('/users/ongoing-friend-reqs');
  return res.data;
};

export const sendFriendReq = async (userId: string) => {
  const res = await axiosInstance.post(`/users/friend-req/${userId}`);
  return res.data;
};

export const getFriendReqs = async (): Promise<IFriendReqExtend> => {
  const res = await axiosInstance.get<IFriendReqExtend>('/users/friend-req');
  return res.data;
};

export const acceptFriendReq = async (friendReqId: string) => {
  const res = await axiosInstance.put(
    `/users/friend-req/${friendReqId}/accept`
  );
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get('/chat/token');
  return res.data;
};
