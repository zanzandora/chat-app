import { getAuthUser } from '@/libs/api';
import type { IUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useAuthUser = () => {
  const authUser = useQuery<{ user: IUser } | undefined>({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false, // auth check
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: true,
  });

  return {
    isLoading: authUser.isLoading,
    isFetching: authUser.isFetching,
    authUser: authUser.data?.user,
  };
};
export default useAuthUser;
