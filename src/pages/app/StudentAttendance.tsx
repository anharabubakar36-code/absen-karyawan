import { useState, useEffect } from 'react';
import { supabase, Profile, Student, StudentAttendance as AttendanceType } from '../../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, Filter, Save, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentAttendanceProps {
  profile: Profile | null;
}

export default function StudentAttendance({ profile }: StudentAttendanceProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  async function fetchClasses() {
    const { data, error } = await supabase
      .from('students')
      .select('class_name');
    
    if (data) {
      const uniqueClasses = Array.from(new Set(data.map(s => s.class_name)));
      setClasses(uniqueClasses);
      if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);
    }
    setLoading(false);
  }

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_name', selectedClass)
      .order('name');

    if (data) {
      setStudents(data);
      // Fetch existing attendance for today
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: attData } = await supabase
        .from('student_attendance')
        .select('student_id, status')
        .eq('date', today);

      const attMap: Record<string, string> = {};
      data.forEach(s => attMap[s.id] = 'hadir'); // Default
      if (attData) {
        attData.forEach(a => attMap[a.student_id] = a.status);
      }
      setAttendance(attMap);
    }
    setLoading(false);
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      date: today,
      status,
      teacher_id: profile.id
    }));

    try {
      // Upsert attendance
      const { error } = await supabase
        .from('student_attendance')
        .upsert(attendanceData, { onConflict: 'student_id, date' });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Gagal menyimpan absensi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Absensi Siswa</h2>
          <p className="text-gray-500 mt-1">Pilih kelas dan lakukan absensi harian</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            >
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <p className="text-sm font-bold text-primary bg-red-50 px-4 py-2 rounded-xl">
            {format(new Date(), 'd MMM yyyy', { locale: id })}
          </p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">No</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">NIS</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-8 py-4 text-sm font-medium text-gray-900">{student.nis}</td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-900">{student.name}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { id: 'hadir', label: 'H', color: 'bg-green-100 text-green-600 border-green-200' },
                        { id: 'izin', label: 'I', color: 'bg-blue-100 text-blue-600 border-blue-200' },
                        { id: 'sakit', label: 'S', color: 'bg-amber-100 text-amber-600 border-amber-200' },
                        { id: 'alpa', label: 'A', color: 'bg-red-100 text-red-600 border-red-200' },
                      ].map((status) => (
                        <button
                          key={status.id}
                          onClick={() => handleStatusChange(student.id, status.id)}
                          className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold transition-all ${
                            attendance[student.id] === status.id
                              ? `${status.color} scale-110 shadow-sm`
                              : 'bg-white text-gray-300 border-gray-100 hover:border-gray-200'
                          }`}
                          title={status.id.toUpperCase()}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">
                    Tidak ada data siswa di kelas ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-500">Izin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-500">Sakit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-500">Alpa</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              success 
                ? 'bg-green-600 text-white shadow-green-100' 
                : 'bg-primary text-white hover:bg-red-800 shadow-red-100'
            } disabled:opacity-50`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : success ? (
              <><CheckCircle2 className="w-5 h-5" /> Tersimpan!</>
            ) : (
              <><Save className="w-5 h-5" /> Simpan Absensi</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
