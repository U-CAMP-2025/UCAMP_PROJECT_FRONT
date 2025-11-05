import AdminPage from '@pages/Admin';
import LandingPage from '@pages/Landing';
import LoginBridge from '@pages/Login/Bridge';
import LogoutComplete from '@pages/Logout';
import MyPage from '@pages/MyPage';
import MyQAPage from '@pages/MyQA';
import QACreatePage from '@pages/MyQA/QaCreatePage';
import QAUpdatePage from '@pages/MyQA/QaUpdatePage';
import NotFoundPage from '@pages/NotFound';
import QADetailPage from '@pages/QADetail';
import QAListPage from '@pages/QAList';
import RankPage from '@pages/Rank';
import SignupPage from '@pages/Signup';
import SimulationPage from '@pages/Simulation';
import SimulationEndPage from '@pages/Simulation/SimulationEnd';
import SimulationGO from '@pages/Simulation/SimulationGo';
import SimulationRecordPage from '@pages/Simulation/SimulationRecord';
import SimulationResultPage from '@pages/Simulation/SimulationResult';
import TestPage from '@pages/Test';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { RequireAdmin } from './RequireAdmin';

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
        <Route path='/qa/update' element={<QAUpdatePage />} />
        <Route path='/simulation' element={<SimulationPage />} />
        <Route path='/simulation/:simulationId/start' element={<SimulationGO />} />
        <Route path='/simulation/:simulationId/end' element={<SimulationEndPage />} />
        <Route path='/simulation/record' element={<SimulationRecordPage />} />
        <Route path='/simulation/:simulationId/result' element={<SimulationResultPage />} />
        <Route
          path='/admin/user'
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route
          path='/admin/transcription'
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route path='/login/bridge' element={<LoginBridge />} />
        <Route path='/rank' element={<RankPage />} />
        <Route path='/logout/complete' element={<LogoutComplete />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
