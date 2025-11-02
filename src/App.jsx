import { bootstrapAccessToken } from '@api/axios';
import { useEffect } from 'react';

import AppRoutes from './routes';

function App() {
  useEffect(() => {
    bootstrapAccessToken();
  }, []);
  return <AppRoutes />;
}

export default App;
