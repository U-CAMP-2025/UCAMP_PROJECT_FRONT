import { PageContainer } from '@components/layout/PageContainer';
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

import SimulationStart from '../../components/simulation/SimulationStart';
import SimulationGO from './SimulationGo';

const SimulationPage = () => {
  return (
    <PageContainer header footer>
      <NavLink to='/simulation'>면접 시뮬레이션</NavLink> /
      <NavLink to='/simulation/record'>면접 연습 기록</NavLink>
      <Routes>
        <Route index='true' element={<SimulationStart />} />
        {/* <Route path='/record' element={<SimulationGO />} /> */}
        <Route path='/:simulationId/start' element={<SimulationGO />} />
      </Routes>
    </PageContainer>
  );
};

export default SimulationPage;
