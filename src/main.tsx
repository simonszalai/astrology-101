import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import GeocentricView from './pages/GeocentricView';
import ZodiacBelt from './pages/ZodiacBelt';
import RetrogradeMotion from './pages/RetrogradeMotion';
import CyclesView from './pages/CyclesView';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="observer" element={<GeocentricView />} />
          <Route path="zodiac" element={<ZodiacBelt />} />
          <Route path="retrograde" element={<RetrogradeMotion />} />
          <Route path="cycles" element={<CyclesView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
