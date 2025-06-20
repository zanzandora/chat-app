import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';
import useAuthUser from './hooks/useAuthUser';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotificationPage = lazy(() => import('./pages/NotificationPage'));
const CallPage = lazy(() => import('./pages/CallPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const OnBoardingPage = lazy(() => import('./pages/OnBoardingPage'));
const MainLayout = lazy(() => import('./layout/MainLayout'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));

function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.inOnboarded;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div data-theme={theme}>
      <Suspense fallback={<Loader />}>
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
                <MainLayout showSidebar={false}>
                  <ChatPage />
                </MainLayout>
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
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
