import AdminTranscriptionPage from '@pages/Admin/Transcription';
import AdminUserPage from '@pages/Admin/User';
import LandingPage from '@pages/Landing';
import MyPage from '@pages/MyPage';
import MyQAPage from '@pages/MyQA';
import NotFoundPage from '@pages/NotFound';
import QAListPage from '@pages/QAList';
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
        <Route path='/qalist' element={<QAListPage />} />
        <Route path='/myqa' element={<MyQAPage />} />
        <Route path='/admin/user' element={<AdminUserPage />} />
        <Route path='/admin/transcription' element={<AdminTranscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
