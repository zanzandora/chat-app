// hooks/useSignUp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/libs/api';
import toast from 'react-hot-toast';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Log out successful');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};
