import LandingPage from '@pages/Landing';
import NotFoundPage from '@pages/NotFound';
import SimulationPage from '@pages/Simulation/SmulationPage';
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
        <Route path='/simulation/*' element={<SimulationPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
