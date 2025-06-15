// hooks/useSignUp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IUser } from '@/types';
import { signup } from '@/libs/api';

export type ISignUp = {
  fullname: IUser['fullname'];
  email: IUser['email'];
  password: IUser['password'];
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });
};
