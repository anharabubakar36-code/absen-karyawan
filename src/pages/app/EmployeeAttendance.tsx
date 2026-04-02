import { useState, useEffect } from 'react';
import { supabase, Profile, EmployeeAttendance as AttendanceType } from '../../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, MapPin, CheckCircle2, AlertCircle, History } from 'lucide-react';
import { motion } from 'motion/react';

interface EmployeeAttendanceProps {
  profile: Profile | null;
}

export default function EmployeeAttendance({ profile }: EmployeeAttendanceProps) {
  const [attendance, setAttendance] = useState<AttendanceType | null>(null);
  const [history, setHistory] = useState<AttendanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchTodayAttendance();
    fetchHistory();
    return () => clearInterval(timer);
  }, [profile]);

  async function fetchTodayAttendance() {
    if (!profile) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('user_id', profile.id)
      .eq('date', today)
      .single();

    if (data) setAttendance(data);
    setLoading(false);
  }

  async function fetchHistory() {
    if (!profile) return;
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('user_id', profile.id)
      .order('date', { ascending: false })
      .limit(10);

    if (data) setHistory(data);
  }

  const handleCheckIn = async () => {
    if (!profile) return;
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const time = format(now, 'HH:mm:ss');

    try {
      const { data, error } = await supabase
        .from('employee_attendance')
        .insert([
          { 
            user_id: profile.id, 
            date: today, 
            check_in: time, 
            status: 'hadir' 
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setAttendance(data);
      fetchHistory();
    } catch (error) {
      console.error('Error check-in:', error);
      alert('Gagal melakukan Check-in');
    }
  };

  const handleCheckOut = async () => {
    if (!attendance) return;
    const now = new Date();
    const time = format(now, 'HH:mm:ss');

    try {
      const { data, error } = await supabase
        .from('employee_attendance')
        .update({ check_out: time })
        .eq('id', attendance.id)
        .select()
        .single();

      if (error) throw error;
      setAttendance(data);
      fetchHistory();
    } catch (error) {
      console.error('Error check-out:', error);
      alert('Gagal melakukan Check-out');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Time Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-gray-500 font-medium mb-2 uppercase tracking-widest text-sm">Waktu Saat Ini</h2>
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {format(currentTime, 'HH:mm:ss')}
        </div>
        <p className="text-gray-500 font-medium">
          {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Action Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-6">
          {!attendance ? (
            <>
              <div className="bg-red-50 p-6 rounded-full">
                <Clock className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Belum Absen</h3>
                <p className="text-gray-500 text-sm mt-1">Silakan lakukan check-in hari ini</p>
              </div>
              <button
                onClick={handleCheckIn}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-red-800 transition-all shadow-lg shadow-red-100"
              >
                Check In Sekarang
              </button>
            </>
          ) : !attendance.check_out ? (
            <>
              <div className="bg-amber-50 p-6 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-secondary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Sudah Check-in</h3>
                <p className="text-gray-500 text-sm mt-1">Check-in pada {attendance.check_in}</p>
              </div>
              <button
                onClick={handleCheckOut}
                className="w-full bg-secondary text-white py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
              >
                Check Out Sekarang
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-50 p-6 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Absensi Selesai</h3>
                <p className="text-gray-500 text-sm mt-1">Sampai jumpa besok!</p>
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-400 uppercase font-bold">Masuk</p>
                  <p className="font-bold text-gray-900">{attendance.check_in}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-400 uppercase font-bold">Pulang</p>
                  <p className="font-bold text-gray-900">{attendance.check_out}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* History Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900">Riwayat Terakhir</h3>
          </div>
          
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {format(new Date(item.date), 'd MMM yyyy', { locale: id })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.check_in} - {item.check_out || '--:--'}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                  {item.status}
                </span>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-8 text-gray-400 italic text-sm">
                Belum ada riwayat absensi
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
