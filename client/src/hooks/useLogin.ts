// hooks/useSignUp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IUser } from '@/types';
import { login } from '@/libs/api';

export type ILogin = {
  email: IUser['email'];
  password: IUser['password'];
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });
};
