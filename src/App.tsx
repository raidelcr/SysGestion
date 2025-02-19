import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { Settings } from './pages/Settings';
import { Modules } from './pages/Modules';
import { Contracts } from './pages/Contracts';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Update the HTML element class based on the theme
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.mode]);

  const DashboardComponent = user?.role === 'admin' ? AdminDashboard : UserDashboard;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardComponent />} />
          <Route path="contracts" element={<Contracts />} />
          <Route 
            path="settings" 
            element={
              user?.role === 'admin' ? <Settings /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="modules" 
            element={
              user?.role === 'admin' ? <Modules /> : <Navigate to="/" replace />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App