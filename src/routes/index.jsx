import LandingPage from '@pages/Landing';
import NotFoundPage from '@pages/NotFound';
import TestPage from '@pages/Test';
import CreatePage from '@pages/Users/CreatePage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/test' element={<TestPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/admin' element={<CreatePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
