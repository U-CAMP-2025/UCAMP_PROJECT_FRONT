import AdminPage from '@pages/Admin';
import LandingPage from '@pages/Landing';
import LoginBridge from '@pages/Login/Bridge';
import MyPage from '@pages/MyPage';
import MyQAPage from '@pages/MyQA';
import QACreatePage from '@pages/MyQA/QaCreatePage';
import NotFoundPage from '@pages/NotFound';
import QADetailPage from '@pages/QADetail';
import QAListPage from '@pages/QAList';
import SignupPage from '@pages/Signup';
import SimulationPage from '@pages/Simulation';
import SimulationEndPage from '@pages/Simulation/SimulationEnd';
import SimulationGO from '@pages/Simulation/SimulationGo';
import TestPage from '@pages/Test';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/test' element={<TestPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/qalist' element={<QAListPage />} />
        <Route path='/qa/:qaId' element={<QADetailPage />} />
        <Route path='/myqa' element={<MyQAPage />} />
        <Route path='/qa/create' element={<QACreatePage />} />
        <Route path='/simulation' element={<SimulationPage />} />
        <Route path='/simulation/:simulationId/start' element={<SimulationGO />} />
        <Route path='/simulation/:simulationId/end' element={<SimulationEndPage />} />
        <Route path='/admin/user' element={<AdminPage />} />
        <Route path='/admin/transcription' element={<AdminPage />} />
        <Route path='/login/bridge' element={<LoginBridge />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
