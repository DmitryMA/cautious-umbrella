import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProfilesPage from '../pages/profiles.page';
import RequestQueuePage from '../pages/request-queue.page';
import StreamReaderPage from '../pages/stream-reader.page';

import Layout from './components/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Navigate to='/task/1' />} />
          <Route path='/task' element={<Layout />}>
            <Route path='1' element={<ProfilesPage />} />
            <Route path='2' element={<StreamReaderPage />} />
            <Route path='3' element={<RequestQueuePage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
