import AdminPage from '@pages/Admin';
import LandingPage from '@pages/Landing';
import MyPage from '@pages/MyPage';
import MyQAPage from '@pages/MyQA';
import QACreatePage from '@pages/MyQA/QaCreatePage';
import NotFoundPage from '@pages/NotFound';
import QAListPage from '@pages/QAList';
import SignupPage from '@pages/Signup';
import TestPage from '@pages/Test';
import RegistPage from '@pages/Users/RegistPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/test' element={<TestPage />} />
        <Route path='/admin' element={<RegistPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/qalist' element={<QAListPage />} />
        <Route path='/myqa' element={<MyQAPage />} />
        <Route path='/qa/create' element={<QACreatePage />} />
        <Route path='/admin/user' element={<AdminPage />} />
        <Route path='/admin/transcription' element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
