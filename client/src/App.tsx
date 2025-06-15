import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnBoardingPage from './pages/OnBoardingPage';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './libs/axios';
import PrivateRoute from './components/ProtectedRoute ';
import Loader from './components/Loader';

function App() {
  const { data: authData, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='h-screen w-screen' data-theme='night'>
      <Routes>
        <Route
          path='/signup'
          element={!authData ? <SignUpPage /> : <Navigate to='/' replace />}
        />
        <Route
          path='/login'
          element={!authData ? <LoginPage /> : <Navigate to='/' replace />}
        />

        {/* Sử dụng PrivateRoute làm route cha để bảo vệ các route con */}
        <Route element={<PrivateRoute authUser={authUser} />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/notification' element={<NotificationPage />} />
          <Route path='/call' element={<CallPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/onboarding' element={<OnBoardingPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
