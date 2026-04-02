import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, Profile } from '../lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  GraduationCap, 
  ClipboardList, 
  LogOut, 
  ChevronRight,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AppLayoutProps {
  profile: Profile | null;
}

export default function AppLayout({ profile }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      path: '/app', 
      icon: LayoutDashboard, 
      roles: ['admin', 'guru', 'staff'] 
    },
    { 
      title: 'Absensi Karyawan', 
      path: '/app/absensi-karyawan', 
      icon: UserCheck, 
      roles: ['admin', 'guru', 'staff'] 
    },
    { 
      title: 'Absensi Siswa', 
      path: '/app/absensi-siswa', 
      icon: ClipboardList, 
      roles: ['admin', 'guru'] 
    },
    { 
      title: 'Data Siswa', 
      path: '/app/data-siswa', 
      icon: GraduationCap, 
      roles: ['admin'] 
    },
    { 
      title: 'User Management', 
      path: '/app/user-management', 
      icon: Users, 
      roles: ['admin'] 
    },
  ];

  const recapSubmenu = [
    { 
      title: 'Absensi Karyawan', 
      path: '/app/rekap/karyawan', 
      roles: ['admin'] 
    },
    { 
      title: 'Absensi Siswa', 
      path: '/app/rekap/siswa', 
      roles: ['admin', 'guru'] 
    },
  ];

  const filteredRecap = recapSubmenu.filter(item => item.roles.includes(profile?.role || ''));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-primary p-2 rounded-lg flex-shrink-0">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-gray-900 truncate">SMK Prima Unggul</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.filter(item => item.roles.includes(profile?.role || '')).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-red-50 text-primary font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                location.pathname === item.path ? 'text-primary' : 'text-gray-400'
              }`} />
              {isSidebarOpen && <span>{item.title}</span>}
            </Link>
          ))}

          {/* Recap Submenu Header */}
          {filteredRecap.length > 0 && (
            <div className="pt-4">
              {isSidebarOpen && (
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Rekap Absensi
                </p>
              )}
              {filteredRecap.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all mb-1 ${
                    location.pathname === item.path
                      ? 'bg-amber-50 text-secondary font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    location.pathname === item.path ? 'bg-secondary' : 'bg-gray-300'
                  }`} />
                  {isSidebarOpen && <span className="text-sm">{item.title}</span>}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(i => i.path === location.pathname)?.title || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{profile?.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-secondary font-bold border-2 border-white shadow-sm">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
