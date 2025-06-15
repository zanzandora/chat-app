import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnBoardingPage from './pages/OnBoardingPage';
import PrivateRoute from './components/ProtectedRoute ';
import Loader from './components/Loader';
import useAuthUser from './hooks/useAuthUser';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);

  const isOnBoarded = authUser?.inOnboarded;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='h-screen ' data-theme='dracula'>
      <Routes>
        <Route
          path='/signup'
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to='/' replace />
          }
        />
        <Route
          path='/login'
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to='/' replace />
          }
        />

        {/* Sử dụng PrivateRoute làm route cha để bảo vệ các route con */}
        <Route element={<PrivateRoute authUser={authUser} />}>
          <Route
            path='/'
            element={
              isAuthenticated && isOnBoarded ? (
                <HomePage />
              ) : (
                <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
              )
            }
          />
          <Route path='/notification' element={<NotificationPage />} />
          <Route path='/call' element={<CallPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/onboarding' element={<OnBoardingPage />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
