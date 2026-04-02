import { Profile } from '../../lib/supabase';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  ClipboardList, 
  Calendar, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DashboardProps {
  profile: Profile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const today = new Date();
  const formattedDate = format(today, 'EEEE, d MMMM yyyy', { locale: id });

  const stats = [
    { 
      label: 'Kehadiran Anda', 
      value: '98%', 
      icon: UserCheck, 
      color: 'bg-green-100 text-green-600',
      roles: ['admin', 'guru', 'staff']
    },
    { 
      label: 'Siswa Terdaftar', 
      value: '1,240', 
      icon: GraduationCap, 
      color: 'bg-blue-100 text-blue-600',
      roles: ['admin', 'guru']
    },
    { 
      label: 'Absensi Hari Ini', 
      value: '85%', 
      icon: ClipboardList, 
      color: 'bg-amber-100 text-amber-600',
      roles: ['admin', 'guru']
    },
    { 
      label: 'Total Karyawan', 
      value: '45', 
      icon: Users, 
      color: 'bg-red-100 text-red-600',
      roles: ['admin']
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat Datang, {profile?.full_name}! 👋
          </h1>
          <p className="mt-2 text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {formattedDate}
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookOpen className="w-40 h-40 text-primary" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.filter(s => s.roles.includes(profile?.role || '')).map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className={`p-3 rounded-xl w-fit mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h3>
            <button className="text-primary text-sm font-semibold hover:underline">Lihat Semua</button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Absensi Siswa Kelas XII RPL 1
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Dilakukan oleh Guru Budi Santoso • 08:30 WIB
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">
                    Selesai
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-gradient-to-br from-primary to-red-900 p-8 rounded-3xl shadow-lg text-white">
          <h3 className="text-xl font-bold mb-6">Informasi Sekolah</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-red-200">Akreditasi</p>
                <p className="text-sm font-bold">A (Sangat Baik)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-red-200">Total Siswa</p>
                <p className="text-sm font-bold">1,240 Siswa</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-xs italic text-red-100">
                "Unggul dalam Prestasi, Terpuji dalam Pekerti, Terampil dalam Teknologi"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookOpen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
