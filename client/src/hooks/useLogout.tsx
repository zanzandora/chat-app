// hooks/useSignUp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/libs/api';
import toast from 'react-hot-toast';
import { useOnlineStatusStore } from '@/store/onlineStatusStore';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { reset } = useOnlineStatusStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Log out successful');
    },
  });
};
