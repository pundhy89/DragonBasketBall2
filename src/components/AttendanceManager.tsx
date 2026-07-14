/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Student, Coach, StudentSkills } from '../types';
import { Calendar, Check, AlertCircle, RefreshCw, ClipboardCheck, Sparkles, User, Filter, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AttendanceManagerProps {
  students: Student[];
  onUpdateAttendance: (studentId: string, date: string, status: 'present' | 'absent' | 'sick' | 'late') => void;
  onSendNotification: (studentId: string, title: string, message: string, type: 'attendance' | 'report_card' | 'schedule' | 'general') => void;
  coaches: Coach[];
  onUpdateStudent?: (studentId: string, data: Partial<Student>) => void;
}

const CLASS_LEVELS = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'] as const;

export default function AttendanceManager({
  students,
  onUpdateAttendance,
  onSendNotification,
  coaches,
  onUpdateStudent
}: AttendanceManagerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-26');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  
  // Daily Session Coach Selection
  const [sessionCoachId, setSessionCoachId] = useState<string>('c_1');
  
  // Class filter state
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');

  // Daily Evaluation Form State
  const [evalStudentId, setEvalStudentId] = useState<string | null>(null);
  const [evalForm, setEvalForm] = useState<{
    skills: StudentSkills;
    notes: string;
  } | null>(null);

  const selectedCoach = useMemo(() => {
    return coaches.find(c => c.id === sessionCoachId) || coaches[0] || { id: 'fallback', name: 'Unknown Coach', role: 'Coach', avatar: '👤', specialty: '-' } as Coach;
  }, [coaches, sessionCoachId]);

  // Filter students by selected class level
  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (selectedClassFilter !== 'All') {
      list = list.filter(s => s.classLevel === selectedClassFilter);
    }
    return list;
  }, [students, selectedClassFilter]);

  // Stats calculation for the filtered or all students
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let sick = 0;
    let absent = 0;
    let total = filteredStudents.length;

    filteredStudents.forEach((s) => {
      const status = s.attendanceHistory[selectedDate];
      if (status === 'present') present++;
      else if (status === 'late') late++;
      else if (status === 'sick') sick++;
      else if (status === 'absent') absent++;
    });

    const recorded = present + late + sick + absent;
    const rate = recorded > 0 ? Math.round(((present + late) / recorded) * 100) : 0;

    return {
      present,
      late,
      sick,
      absent,
      recorded,
      unrecorded: total - recorded,
      rate
    };
  }, [filteredStudents, selectedDate]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'sick' | 'late') => {
    onUpdateAttendance(studentId, selectedDate, status);
  };

  // Trigger quick notifications to parents of absent/sick students with session coach details
  const handleAutoNotifyParents = () => {
    let notifiedCount = 0;
    filteredStudents.forEach((s) => {
      const status = s.attendanceHistory[selectedDate];
      if (status === 'absent') {
        const message = `Pemberitahuan Basket: Yth. Wali murid dari ${s.name} (${s.classLevel}), diinformasikan oleh ${selectedCoach.name} bahwa anak Anda ALFA (tidak hadir) pada sesi latihan ${selectedDate}. Mohon dikonfirmasi kehadirannya.`;
        onSendNotification(s.id, 'Pemberitahuan Absensi', message, 'attendance');
        notifiedCount++;
      } else if (status === 'sick') {
        const message = `Pemberitahuan Basket: Yth. Wali murid ${s.name}, laporan sakit telah diterima oleh ${selectedCoach.name}. Kami mendoakan agar ${s.name} lekas sembuh dan bisa segera berlatih kembali.`;
        onSendNotification(s.id, 'Doa Lekas Sembuh', message, 'attendance');
        notifiedCount++;
      }
    });

    if (notifiedCount > 0) {
      setAlertMessage(`Pemberitahuan dikirim! Berhasil mengirim ${notifiedCount} pesan WhatsApp otomatis ke orang tua siswa oleh ${selectedCoach.name}.`);
      setTimeout(() => setAlertMessage(null), 4000);
    } else {
      setAlertMessage(`Semua murid hadir di kelas ${selectedClassFilter === 'All' ? 'keseluruhan' : selectedClassFilter}! Tidak ada laporan absen yang perlu dikirim.`);
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  const attendanceDates = [
    '2026-06-21',
    '2026-06-22',
    '2026-06-23',
    '2026-06-24',
    '2026-06-25',
    '2026-06-26'
  ];

  return (
    <div className="space-y-6" id="attendance-workspace">
      
      {/* Date selector header & Coach selection */}
      <div className="neu-flat p-6 shadow-lg flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl neu-pressed border border-blue-500/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(249,115,22,0.15)] shrink-0">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-primary uppercase tracking-widest leading-none mb-1.5">Absensi Harian & Evaluasi Sesi</h4>
            <span className="text-[11px] text-secondary font-medium">Lakukan pencatatan presensi siswa terstruktur per kelompok kelas.</span>
          </div>
        </div>

        {/* Coach-in-Charge Dropdown */}
        <div className="neu-pressed border border-theme rounded-xl p-3 flex items-center gap-3 self-start xl:self-auto min-w-[280px]">
          <div className="w-9 h-9 rounded-full border border-blue-500/50 bg-secondary flex items-center justify-center text-base shadow-sm shrink-0 overflow-hidden">
            {selectedCoach.avatar?.startsWith('http') || selectedCoach.avatar?.startsWith('data:') ? (
              <img src={selectedCoach.avatar} alt={selectedCoach.name} className="w-full h-full object-cover" />
            ) : (
              selectedCoach.avatar || '👤'
            )}
          </div>
          <div className="flex-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block leading-none mb-1">Pelatih Pengampu Sesi:</label>
            <select
              value={sessionCoachId}
              onChange={(e) => setSessionCoachId(e.target.value)}
              className="text-xs font-bold text-primary bg-transparent border-none outline-none p-0 w-full cursor-pointer"
            >
              {coaches.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date options Dropdown & WhatsApp Broadcast */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Tanggal:</span>
          <select
            id="select-attendance-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-[11px] font-bold border border-theme neu-pressed text-primary rounded-xl py-2 px-3 shadow-md cursor-pointer outline-none focus:border-blue-500 transition-colors"
          >
            {attendanceDates.map((date) => (
              <option key={date} value={date}>
                {date === '2026-06-26' ? `${date} (Hari Ini)` : date}
              </option>
            ))}
          </select>

          <button
            id="btn-auto-notify-parents"
            onClick={handleAutoNotifyParents}
            className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-orange-600 text-primary border border-blue-400 px-4 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ml-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            Kirim WhatsApp Ortu
          </button>
        </div>

      </div>

      {/* Class Filtering Bar */}
      <div className="neu-flat p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-secondary">
          <Filter className="w-4 h-4 text-blue-500" />
          <span>Saring Berdasarkan Kelompok Kelas:</span>
        </div>
        
        <div className="flex flex-wrap gap-2" id="attendance-class-filters">
          <button
            onClick={() => setSelectedClassFilter('All')}
            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all cursor-pointer ${
              selectedClassFilter === 'All'
                ? 'neu-button-accent/20 text-blue-500 border border-blue-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                : 'neu-pressed text-secondary border border-theme hover:border-slate-600'
            }`}
          >
            Semua Murid ({students.length})
          </button>
          {CLASS_LEVELS.map((level) => {
            const count = students.filter(s => s.classLevel === level).length;
            return (
              <button
                key={level}
                onClick={() => setSelectedClassFilter(level)}
                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedClassFilter === level
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'neu-pressed text-secondary border border-theme hover:border-slate-600'
                }`}
              >
                {level} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Counter Row for active filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5" id="attendance-counters">
        <div className="neu-flat p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[9px] text-secondary block font-bold uppercase tracking-widest mb-1">Persentase Hadir</span>
            <span className="text-3xl font-black text-primary">{stats.rate}%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl neu-pressed flex items-center justify-center text-emerald-500 text-xl font-black border border-theme shadow-inner">
            %
          </div>
        </div>

        <div className="neu-flat p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[9px] text-secondary block font-bold uppercase tracking-widest mb-1">Hadir / Terlambat</span>
            <span className="text-3xl font-black text-emerald-500">{stats.present + stats.late} <span className="text-sm font-medium text-secondary">/ {filteredStudents.length}</span></span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-lg font-black border border-emerald-500/20">
            H
          </div>
        </div>

        <div className="neu-flat p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[9px] text-secondary block font-bold uppercase tracking-widest mb-1">Sakit / Izin</span>
            <span className="text-3xl font-black text-yellow-500">{stats.sick} <span className="text-sm font-medium text-secondary">Atlit</span></span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-lg font-black border border-yellow-500/20">
            S
          </div>
        </div>

        <div className="neu-flat p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[9px] text-secondary block font-bold uppercase tracking-widest mb-1">Mangkir (Alfa)</span>
            <span className="text-3xl font-black text-rose-500">{stats.absent} <span className="text-sm font-medium text-secondary">Atlit</span></span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 text-lg font-black border border-rose-500/20">
            A
          </div>
        </div>
      </div>

      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[11px] font-bold tracking-wide flex items-center gap-3 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Attendance Spreadsheet Roster */}
      <div className="neu-flat p-6 md:p-8 shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-theme text-secondary text-[10px] uppercase font-bold tracking-widest">
                <th className="pb-4 pl-2">Atlit Basketball</th>
                <th className="pb-4 text-center">Tingkat Kelas</th>
                <th className="pb-4 text-center">Kehadiran Kumulatif</th>
                <th className="pb-4 text-center">Ubah Status Absensi Sesi</th>
                <th className="pb-4 pr-2 text-right">Evaluasi Harian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c28]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondary text-xs font-medium bg-primary/50 rounded-xl">
                    Tidak ada siswa yang terdaftar di kelas "{selectedClassFilter}".
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const currentStatus = s.attendanceHistory[selectedDate];
                  
                  // Calculate individual attendance rates
                  const historyValues = Object.values(s.attendanceHistory);
                  const attendedCount = historyValues.filter(st => st === 'present' || st === 'late').length;
                  const indRate = historyValues.length > 0 ? Math.round((attendedCount / historyValues.length) * 100) : 100;

                  // Class badge colors
                  const classColors: Record<string, string> = {
                    'SD Lower': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                    'SD Berkembang': 'neu-button-accent/10 text-blue-400 border-blue-500/30',
                    'SD Upper': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                    'SMP': 'neu-button-accent/10 text-blue-400 border-blue-500/30',
                    'SMA': 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  };

                  return (
                    <tr key={s.id} id={`row-student-attendance-${s.id}`} className="hover:neu-pressed/60 transition-all">
                      
                      {/* Athlete Name Card */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-blue-500/30 bg-secondary flex items-center justify-center text-lg shadow-sm overflow-hidden">
                            {s.avatar?.startsWith('http') || s.avatar?.startsWith('data:') ? (
                              <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                            ) : (
                              s.avatar || '🏀'
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-primary text-sm block leading-tight mb-0.5">{s.name}</span>
                            <span className="text-[9px] text-secondary font-bold uppercase tracking-widest">{s.position}</span>
                          </div>
                        </div>
                      </td>

                      {/* Class level division */}
                      <td className="py-4 text-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full ${classColors[s.classLevel] || 'neu-pressed text-secondary'}`}>
                          {s.classLevel}
                        </span>
                      </td>

                      {/* Attendance percentage indicator */}
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                            indRate >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            indRate >= 75 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}>
                            {indRate}%
                          </span>
                          <span className="text-[9px] text-secondary mt-1 uppercase tracking-widest font-bold">Total Latihan: {historyValues.length}</span>
                        </div>
                      </td>

                      {/* Interactive 3D pill options */}
                      <td className="py-4 pr-2 text-right md:text-center">
                        <div className="inline-flex items-center gap-1.5 p-1 bg-primary rounded-xl border border-theme">
                          
                          <button
                            id={`btn-attend-${s.id}-present`}
                            onClick={() => handleStatusChange(s.id, 'present')}
                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-500 text-primary shadow-md scale-105'
                                : 'text-secondary hover:neu-pressed'
                            }`}
                          >
                            Hadir
                          </button>

                          <button
                            id={`btn-attend-${s.id}-late`}
                            onClick={() => handleStatusChange(s.id, 'late')}
                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              currentStatus === 'late'
                                ? 'bg-yellow-500 text-slate-900 shadow-md scale-105'
                                : 'text-secondary hover:neu-pressed'
                            }`}
                          >
                            Izin
                          </button>

                          <button
                            id={`btn-attend-${s.id}-sick`}
                            onClick={() => handleStatusChange(s.id, 'sick')}
                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              currentStatus === 'sick'
                                ? 'neu-button-accent scale-105'
                                : 'text-secondary hover:neu-pressed'
                            }`}
                          >
                            Sakit
                          </button>

                          <button
                            id={`btn-attend-${s.id}-absent`}
                            onClick={() => handleStatusChange(s.id, 'absent')}
                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-500 text-primary shadow-md scale-105'
                                : 'text-secondary hover:neu-pressed'
                            }`}
                          >
                            Alfa
                          </button>

                        </div>
                      </td>

                      {/* Evaluasi Harian Button */}
                      <td className="py-4 pr-2 text-right">
                        <button
                          onClick={() => {
                            setEvalStudentId(s.id);
                            setEvalForm({
                              skills: s.skills,
                              notes: s.notes || ''
                            });
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-primary neu-button-accent/10 hover:neu-button-accent border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Nilai
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Unrecorded Alert Box */}
        {stats.unrecorded > 0 && (
          <div className="mt-5 p-4 neu-button-accent/10 border border-blue-500/30 text-blue-400 rounded-xl text-[11px] font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
            <span>Ada <strong className="text-primary">{stats.unrecorded} murid</strong> belum dicatat kehadirannya pada tanggal {selectedDate}. Lengkapi presensi di atas untuk validasi data evaluasi harian.</span>
          </div>
        )}
      </div>

      {/* Daily Evaluation Modal */}
      <AnimatePresence>
        {evalStudentId && evalForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEvalStudentId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-primary border border-blue-500/30 rounded-2xl p-5 md:p-6 w-full max-w-lg shadow-2xl space-y-4 text-xs text-slate-300 max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
            >
              <div className="flex justify-between items-center border-b border-theme pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-primary uppercase text-[11px] tracking-widest">
                    Evaluasi Harian & Penilaian Sesi
                  </span>
                </div>
                <button type="button" onClick={() => setEvalStudentId(null)} className="text-secondary hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(evalForm.skills).map(([skill, val]) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <label className="font-bold uppercase tracking-widest text-secondary">{skill}</label>
                        <span className="text-blue-500 font-bold">{val}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) => setEvalForm({
                          ...evalForm,
                          skills: {
                            ...evalForm.skills,
                            [skill]: parseInt(e.target.value, 10)
                          }
                        })}
                        className="w-full accent-orange-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-widest text-[10px] text-secondary">Catatan Harian (Opsional)</label>
                  <textarea
                    placeholder="Contoh: Fokus latihan hari ini baik, butuh perbaikan di footwork."
                    value={evalForm.notes}
                    onChange={(e) => setEvalForm({ ...evalForm, notes: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500/50 min-h-[80px]"
                  />
                </div>

                <button
                  onClick={() => {
                    if (onUpdateStudent) {
                      onUpdateStudent(evalStudentId, {
                        skills: evalForm.skills,
                        notes: evalForm.notes,
                        evaluatedBy: sessionCoachId
                      });
                      setAlertMessage(`Evaluasi berhasil disimpan oleh ${selectedCoach.name}.`);
                      setTimeout(() => setAlertMessage(null), 4000);
                    }
                    setEvalStudentId(null);
                  }}
                  className="w-full bg-gradient-to-r from-purple-700 to-blue-500 text-primary font-bold uppercase tracking-widest py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Check className="w-4 h-4" />
                  Simpan Evaluasi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
