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
import User from '@pages/User';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { RequireAdmin } from './RequireAdmin';
import { RequireLogin } from './RequireLogin';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/qalist' element={<QAListPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login/bridge' element={<LoginBridge />} />
        <Route path='/logout/complete' element={<LogoutComplete />} />
        <Route path='/rank' element={<RankPage />} />
        <Route path='/qalist' element={<QAListPage />} />
        <Route path='/user/:userId' element={<User />} />

        {/** 로그인 필요 */}
        <Route
          path='/mypage'
          element={
            <RequireLogin>
              <MyPage />
            </RequireLogin>
          }
        />
        <Route
          path='/qa/:qaId'
          element={
            <RequireLogin>
              <QADetailPage />
            </RequireLogin>
          }
        />
        <Route
          path='/myqa'
          element={
            <RequireLogin>
              <MyQAPage />
            </RequireLogin>
          }
        />
        <Route
          path='/qa/create'
          element={
            <RequireLogin>
              <QACreatePage />
            </RequireLogin>
          }
        />
        <Route
          path='/qa/update'
          element={
            <RequireLogin>
              <QAUpdatePage />
            </RequireLogin>
          }
        />
        <Route
          path='/simulation'
          element={
            <RequireLogin>
              <SimulationPage />
            </RequireLogin>
          }
        />
        <Route
          path='/simulation/:simulationId/start'
          element={
            <RequireLogin>
              <SimulationGO />
            </RequireLogin>
          }
        />
        <Route
          path='/simulation/:simulationId/end'
          element={
            <RequireLogin>
              <SimulationEndPage />
            </RequireLogin>
          }
        />
        <Route
          path='/simulation/record'
          element={
            <RequireLogin>
              <SimulationRecordPage />
            </RequireLogin>
          }
        />
        <Route
          path='/simulation/:simulationId/result'
          element={
            <RequireLogin>
              <SimulationResultPage />
            </RequireLogin>
          }
        />

        {/** 관리자 권한 필요 */}
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
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
