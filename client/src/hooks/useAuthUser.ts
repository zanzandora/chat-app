import { getAuthUser } from '@/libs/api';
import type { IUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useAuthUser = () => {
  const authUser = useQuery<{ user: IUser } | undefined>({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false, // auth check
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
export default useAuthUser;
