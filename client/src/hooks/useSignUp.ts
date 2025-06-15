// hooks/useSignUp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/libs/axios';
import type { IUser } from '@/types';

type ISignUp = {
  fullname: IUser['fullname'];
  email: IUser['email'];
  password: IUser['password'];
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ISignUp) => {
      const res = await axiosInstance.post('/auth/signup', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });
};
