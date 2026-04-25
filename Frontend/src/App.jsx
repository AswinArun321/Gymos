import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [init, setInit] = useState(false);

  // Initialize the particles engine once at the root level
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        {/* We only render the app once the particles engine is ready */}
        {init ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* CRITICAL FIX: Replaced the <h1> placeholder with your actual component */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;