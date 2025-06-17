import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnBoardingPage from './pages/OnBoardingPage';
import Loader from './components/Loader';
import useAuthUser from './hooks/useAuthUser';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layout/MainLayout';
import FriendsPage from './pages/FriendsPage';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { isLoading, authUser } = useAuthUser();

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.inOnboarded;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='h-screen ' data-theme={theme}>
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated && isOnBoarded ? (
              <MainLayout showSidebar={true}>
                <HomePage />
              </MainLayout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path='/signup'
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnBoarded ? '/' : '/onboarding'} />
            )
          }
        />
        <Route
          path='/login'
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnBoarded ? '/' : '/onboarding'} />
            )
          }
        />
        <Route
          path='/friends'
          element={
            isAuthenticated && isOnBoarded ? (
              <MainLayout showSidebar={true}>
                <FriendsPage />
              </MainLayout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path='/notifications'
          element={
            isAuthenticated && isOnBoarded ? (
              <MainLayout showSidebar={true}>
                <NotificationPage />
              </MainLayout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path='/call/:id'
          element={
            isAuthenticated && isOnBoarded ? (
              <MainLayout showSidebar={false}>
                <CallPage />
              </MainLayout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />

        <Route
          path='/chat/:id'
          element={
            isAuthenticated && isOnBoarded ? (
              <ChatPage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />

        <Route
          path='/onboarding'
          element={
            isAuthenticated ? (
              !isOnBoarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to='/' />
              )
            ) : (
              <Navigate to='/login' />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
