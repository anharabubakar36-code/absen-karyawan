import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Download, FileText, Search, Filter } from 'lucide-react';

interface RecapAttendanceProps {
  type: 'employee' | 'student';
}

export default function RecapAttendance({ type }: RecapAttendanceProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecap();
  }, [type, month]);

  async function fetchRecap() {
    setLoading(true);
    const start = startOfMonth(new Date(month));
    const end = endOfMonth(new Date(month));

    if (type === 'employee') {
      const { data: attData } = await supabase
        .from('employee_attendance')
        .select(`
          *,
          profiles (full_name, nip)
        `)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))
        .order('date', { ascending: false });
      
      if (attData) setData(attData);
    } else {
      const { data: attData } = await supabase
        .from('student_attendance')
        .select(`
          *,
          students (name, nis, class_name),
          profiles (full_name)
        `)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))
        .order('date', { ascending: false });
      
      if (attData) setData(attData);
    }
    setLoading(false);
  }

  const filteredData = data.filter(item => {
    const name = type === 'employee' ? item.profiles?.full_name : item.students?.name;
    const identifier = type === 'employee' ? item.profiles?.nip : item.students?.nis;
    return (
      name?.toLowerCase().includes(search.toLowerCase()) ||
      identifier?.includes(search)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Rekap Absensi {type === 'employee' ? 'Karyawan' : 'Siswa'}
          </h2>
          <p className="text-gray-500 mt-1">Laporan kehadiran periode {format(new Date(month), 'MMMM yyyy', { locale: id })}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm w-48"
            />
          </div>
          <button className="flex items-center gap-2 bg-secondary text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100">
            <Download className="w-5 h-5" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {type === 'employee' ? 'Nama Karyawan' : 'Nama Siswa'}
                </th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {type === 'employee' ? 'NIP' : 'NIS/Kelas'}
                </th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {type === 'employee' ? 'Jam Masuk/Pulang' : 'Status'}
                </th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm font-medium text-gray-900">
                    {format(new Date(item.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-8 py-4 text-sm font-bold text-gray-900">
                    {type === 'employee' ? item.profiles?.full_name : item.students?.name}
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-500">
                    {type === 'employee' ? (
                      item.profiles?.nip || '-'
                    ) : (
                      <div className="flex flex-col">
                        <span>{item.students?.nis}</span>
                        <span className="text-[10px] font-bold text-secondary uppercase">{item.students?.class_name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    {type === 'employee' ? (
                      <div className="text-sm">
                        <span className="text-green-600 font-bold">{item.check_in}</span>
                        <span className="mx-1 text-gray-300">|</span>
                        <span className="text-amber-600 font-bold">{item.check_out || '--:--'}</span>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                        item.status === 'hadir' ? 'bg-green-100 text-green-700' :
                        item.status === 'izin' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'sakit' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className="text-xs text-gray-400 italic">
                      {type === 'student' ? `Oleh: ${item.profiles?.full_name}` : '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">
                    Tidak ada data absensi untuk periode ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
