import { createRoot } from 'react-dom/client';
import 'stream-chat-react/dist/css/v2/index.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './context/SocketProvider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
