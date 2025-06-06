
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import TonelManagementPage from './pages/TonelManagementPage';
import TonelDetailPage from './pages/TonelDetailPage';
import LoteManagementPage from './pages/LoteManagementPage';
import MttoTonelPage from './pages/MttoTonelPage'; // Was MaintenancePage, now specific to Toneles
import ReportsPage from './pages/ReportsPage';
import DispensadorManagementPage from './pages/DispensadorManagementPage';
import DispensadorDetailPage from './pages/DispensadorDetailPage';
import MttoDispensadorPage from './pages/MttoDispensadorPage';


const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/toneles" element={<TonelManagementPage />} />
        <Route path="/toneles/:idtonel" element={<TonelDetailPage />} />
        
        <Route path="/lotes" element={<LoteManagementPage />} />
        
        <Route path="/mantenimiento-toneles" element={<MttoTonelPage />} />
        
        <Route path="/dispensadores" element={<DispensadorManagementPage />} />
        <Route path="/dispensadores/:iddispensador" element={<DispensadorDetailPage />} />
        <Route path="/mantenimiento-dispensadores" element={<MttoDispensadorPage />} />

        <Route path="/reportes" element={<ReportsPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
