import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase, Profile } from './lib/supabase';

// Pages (to be created)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/app/Dashboard';
import AppLayout from './layouts/AppLayout';
import EmployeeAttendance from './pages/app/EmployeeAttendance';
import StudentAttendance from './pages/app/StudentAttendance';
import RecapAttendance from './pages/app/RecapAttendance';
import StudentData from './pages/app/StudentData';
import UserManagement from './pages/app/UserManagement';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (configError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-red-100 text-center">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfigurasi Supabase Belum Lengkap</h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Silakan masukkan <strong>VITE_SUPABASE_URL</strong> dan <strong>VITE_SUPABASE_ANON_KEY</strong> di panel <strong>Secrets</strong> (ikon kunci di sebelah kiri) untuk mengaktifkan database.
          </p>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-xl text-xs font-mono text-left text-gray-500 border border-gray-100">
              VITE_SUPABASE_URL="https://xxx.supabase.co"
            </div>
            <div className="bg-gray-50 p-3 rounded-xl text-xs font-mono text-left text-gray-500 border border-gray-100">
              VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR..."
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/app" /> : <LoginPage />} 
        />
        
        {/* Protected App Routes */}
        <Route 
          path="/app" 
          element={session ? <AppLayout profile={profile} /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard profile={profile} />} />
          <Route path="absensi-karyawan" element={<EmployeeAttendance profile={profile} />} />
          
          {/* Guru & Admin Only */}
          <Route 
            path="absensi-siswa" 
            element={profile?.role !== 'staff' ? <StudentAttendance profile={profile} /> : <Navigate to="/app" />} 
          />
          
          {/* Recap Submenu */}
          <Route path="rekap">
            <Route 
              path="karyawan" 
              element={profile?.role === 'admin' ? <RecapAttendance type="employee" /> : <Navigate to="/app" />} 
            />
            <Route 
              path="siswa" 
              element={profile?.role !== 'staff' ? <RecapAttendance type="student" /> : <Navigate to="/app" />} 
            />
          </Route>

          {/* Admin Only */}
          <Route 
            path="data-siswa" 
            element={profile?.role === 'admin' ? <StudentData /> : <Navigate to="/app" />} 
          />
          <Route 
            path="user-management" 
            element={profile?.role === 'admin' ? <UserManagement /> : <Navigate to="/app" />} 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
