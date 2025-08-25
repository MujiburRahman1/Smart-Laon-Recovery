import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import RiskSegmentationPage from './pages/RiskSegmentationPage';
import PredictionResultsPage from './pages/PredictionResultsPage';
import InsightsDashboardPage from './pages/InsightsDashboardPage';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/risk-segmentation" element={<RiskSegmentationPage />} />
              <Route path="/predictions" element={<PredictionResultsPage />} />
              <Route path="/insights" element={<InsightsDashboardPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
