import { Navigate, Outlet } from 'react-router-dom';
import type { IUser } from '@/types';

type Props = {
  authUser: IUser;
};

const PrivateRoute = ({ authUser }: Props) => {
  // Nếu authUser tồn tại, cho phép render component con thông qua Outlet
  // Ngược lại, điều hướng về trang đăng nhập
  return authUser ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
