import LandingPage from '@pages/Landing';
import MyPage from '@pages/MyPage';
import NotFoundPage from '@pages/NotFound';
import TestPage from '@pages/Test';
import RegistPage from '@pages/Users/RegistPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/test' element={<TestPage />} />
        <Route path='/admin' element={<RegistPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/mypage' element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
