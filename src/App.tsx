/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Student, PracticeSession, ParentNotification, StudentSkills, Coach } from './types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE, INITIAL_NOTIFICATIONS, INITIAL_COACHES } from './data/students';
import { useAuth } from './components/FirebaseProvider';
import { useFirebaseSync, syncStudentToFirebase, deleteStudentFromFirebase, syncSessionToFirebase, syncNotificationToFirebase, syncCoachToFirebase, deleteCoachFromFirebase } from './hooks/useFirebaseSync';

// Import components
import StudentStats from './components/StudentStats';
import ReportCard from './components/ReportCard';
import TutorialViewer from './components/TutorialViewer';
import AttendanceManager from './components/AttendanceManager';
import ScheduleManager from './components/ScheduleManager';
import NotificationCenter from './components/NotificationCenter';
import CoachManager from './components/CoachManager';

// Icons
import {
  Trophy,
  Users,
  User,
  Calendar,
  MessageSquare,
  Sparkles,
  Award,
  Video,
  FileSpreadsheet,
  Settings,
  Bell,
  Home,
  Menu,
  X,
  Plus,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Activity,
  LogOut,
  Save,
  Shield,
  Image as ImageIcon,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, signInWithGoogle, logout } = useAuth();
  
  // --- Persistent LocalState Engine ---
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('hoop_portal_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [schedule, setSchedule] = useState<PracticeSession[]>(() => {
    const saved = localStorage.getItem('hoop_portal_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [notifications, setNotifications] = useState<ParentNotification[]>(() => {
    const saved = localStorage.getItem('hoop_portal_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem('hoop_portal_coaches');
    return saved ? JSON.parse(saved) : INITIAL_COACHES;
  });

  const [academySettings, setAcademySettings] = useState(() => {
    const saved = localStorage.getItem('hoop_portal_settings');
    return saved ? JSON.parse(saved) : {
      logoIcon: '🐉',
      logoUrl: '',
      bannerUrl: '',
      title: 'DRAGON',
      subtitle: 'BASKETBALL ACADEMY',
      location: 'Banyuwangi, East Java'
    };
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_1');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutorials' | 'stats' | 'report' | 'attendance' | 'schedule' | 'notifications' | 'settings' | 'coaches'>('coaches');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useFirebaseSync(setStudents, setSchedule, setNotifications, setCoaches);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('hoop_portal_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('hoop_portal_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('hoop_portal_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('hoop_portal_coaches', JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem('hoop_portal_settings', JSON.stringify(academySettings));
  }, [academySettings]);

  // --- Callbacks for State Editing ---
  const handleUpdateSkills = (studentId: string, skills: StudentSkills, notes: string, evaluatedBy?: string) => {
    setStudents(prev => {
      const next = prev.map(s => (s.id === studentId ? { ...s, skills, notes, evaluatedBy } : s));
      const updatedStudent = next.find(s => s.id === studentId);
      if (updatedStudent && user) syncStudentToFirebase(updatedStudent);
      return next;
    });
  };

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'attendanceHistory'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std_${Date.now()}`,
      attendanceHistory: {}
    };
    if (user) syncStudentToFirebase(newStudent);
    setStudents(prev => [...prev, newStudent]);
    setSelectedStudentId(newStudent.id);
  };

  const handleUpdateStudent = (studentId: string, studentData: Partial<Student>) => {
    setStudents(prev => {
      const next = prev.map(s => (s.id === studentId ? { ...s, ...studentData } : s));
      const updatedStudent = next.find(s => s.id === studentId);
      if (updatedStudent && user) syncStudentToFirebase(updatedStudent);
      return next;
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (user) deleteStudentFromFirebase(studentId);
    setStudents(prev => {
      const updated = prev.filter(s => s.id !== studentId);
      if (selectedStudentId === studentId && updated.length > 0) {
        setSelectedStudentId(updated[0].id);
      }
      return updated;
    });
  };

  const handleAddCoach = (coachData: Omit<Coach, 'id'>) => {
    const newCoach: Coach = {
      ...coachData,
      id: `c_${Date.now()}`
    };
    if (user) syncCoachToFirebase(newCoach);
    setCoaches(prev => [...prev, newCoach]);
  };

  const handleUpdateCoach = (coachId: string, coachData: Partial<Coach>) => {
    setCoaches(prev => {
      const next = prev.map(c => (c.id === coachId ? { ...c, ...coachData } : c));
      const updatedCoach = next.find(c => c.id === coachId);
      if (updatedCoach && user) syncCoachToFirebase(updatedCoach);
      return next;
    });
  };

  const handleDeleteCoach = (coachId: string) => {
    if (user) deleteCoachFromFirebase(coachId);
    setCoaches(prev => prev.filter(c => c.id !== coachId));
  };

  const handleUpdateAttendance = (studentId: string, date: string, status: 'present' | 'absent' | 'sick' | 'late') => {
    setStudents(prev => {
      const next = prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            attendanceHistory: {
              ...s.attendanceHistory,
              [date]: status
            }
          };
        }
        return s;
      });
      const updatedStudent = next.find(s => s.id === studentId);
      if (updatedStudent && user) syncStudentToFirebase(updatedStudent);
      return next;
    });
  };

  const handleAddPractice = (session: Omit<PracticeSession, 'id' | 'completed'>) => {
    const newSession: PracticeSession = {
      ...session,
      id: `prac_${Date.now()}`,
      completed: false
    };
    if (user) syncSessionToFirebase(newSession);
    setSchedule(prev => [...prev, newSession]);
  };

  const handleToggleCompletePractice = (id: string) => {
    setSchedule(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, completed: !p.completed } : p));
      const updatedSession = next.find(p => p.id === id);
      if (updatedSession && user) syncSessionToFirebase(updatedSession);
      return next;
    });
  };

  const handleSendNotification = (
    studentId: string,
    title: string,
    message: string,
    type: ParentNotification['type']
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newNotif: ParentNotification = {
      id: `notif_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      channel: 'WhatsApp',
      status: 'sent'
    };
    
    if (user) syncNotificationToFirebase(newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSendCustomNotification = (notif: Omit<ParentNotification, 'id' | 'timestamp' | 'status'>) => {
    const newNotif: ParentNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    if (user) syncNotificationToFirebase(newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleClearNotifications = () => {
    // We are just clearing local state here to keep it simple, ideally this would also delete from DB if needed
    setNotifications([]);
  };

  // --- Summary Metrics Calculations ---
  const globalMetrics = useMemo(() => {
    // Average skill score across squad
    const totalStudents = students.length;
    if (totalStudents === 0) return { avgScore: 0, attendanceRate: 0, totalAlerts: 0 };

    const totalSkillsSum = students.reduce((acc, s) => {
      const skillsArr = Object.values(s.skills) as number[];
      return acc + (skillsArr.reduce((a, b) => a + b, 0) / skillsArr.length);
    }, 0);
    const avgScore = Math.round((totalSkillsSum / totalStudents) * 10) / 10;

    // Attendance rates (overall)
    let totalLogs = 0;
    let totalAttended = 0;
    students.forEach(s => {
      const history = Object.values(s.attendanceHistory);
      totalLogs += history.length;
      totalAttended += history.filter(st => st === 'present' || st === 'late').length;
    });
    const attendanceRate = totalLogs > 0 ? Math.round((totalAttended / totalLogs) * 100) : 95;

    return {
      avgScore,
      attendanceRate,
      totalAlerts: notifications.length
    };
  }, [students, notifications]);

  // Next Practice details
  const nextPractice = useMemo(() => {
    const today = new Date('2026-06-26');
    const upcoming = schedule.filter(p => !p.completed && new Date(p.date) >= today);
    if (upcoming.length === 0) return null;
    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [schedule]);

  // Outstanding athletes (averages > 80)
  const starAthletes = useMemo(() => {
    return students
      .map(s => {
        const skillsArr = Object.values(s.skills) as number[];
        const avg = Math.round(skillsArr.reduce((a, b) => a + b, 0) / 6);
        return { ...s, avg };
      })
      .filter(s => s.avg >= 80)
      .slice(0, 3);
  }, [students]);

  return (
    <div className="min-h-screen font-sans flex flex-col antialiased bg-[#0B0A10] text-[#e2e8f0] pb-20 lg:pb-0 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Top Banner & Header (Customizable Academy Info) */}
      <header className="bg-[#13131a]/80 backdrop-blur-md relative z-50 w-full overflow-hidden aspect-[3452/864] flex flex-col justify-center">
        {academySettings.bannerUrl && (
          <div className="absolute inset-0 z-0">
            <img src={academySettings.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#13131a]/90 via-[#13131a]/60 to-transparent"></div>
          </div>
        )}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative px-4 md:px-8 z-10">
          
          {/* Logo Brand Info */}
          <div className="flex items-center gap-4 cursor-pointer relative z-10 group" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} title="Buka Menu">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-[#0B0A10]/50 group-hover:bg-orange-500/10 transition-colors rounded-2xl flex items-center justify-center text-5xl border border-[#2a2a35] group-hover:border-orange-500/50 overflow-hidden shrink-0 shadow-lg relative">
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20">
                 {isMobileMenuOpen ? <X className="w-8 h-8 text-white" /> : <Menu className="w-8 h-8 text-white" />}
               </div>
               {academySettings.logoUrl ? (
                 <img src={academySettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
               ) : (
                 academySettings.logoIcon
               )}
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white leading-none font-display mb-1 group-hover:text-orange-400 transition-colors">
                {academySettings.title}
              </h1>
              <h2 className="text-sm md:text-lg font-bold uppercase tracking-widest text-orange-500 leading-none">
                {academySettings.subtitle}
              </h2>
              <p className="text-[10px] md:text-xs text-blue-400/80 font-bold tracking-widest mt-2 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {academySettings.location}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation (Floating Bottom Navbar) */}
      <nav className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center gap-1.5 bg-[#13131a]/95 backdrop-blur-md p-2 rounded-2xl border border-[#2a2a35] shadow-2xl z-50">
        <button
          id="tab-btn-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          Beranda
        </button>
        <button
          id="tab-btn-stats"
          onClick={() => setActiveTab('stats')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'stats' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          Atlet
        </button>
        <button
          id="tab-btn-coaches"
          onClick={() => setActiveTab('coaches')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'coaches' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          Pelatih
        </button>
        <button
          id="tab-btn-tutorials"
          onClick={() => setActiveTab('tutorials')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tutorials' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <Video className="w-4 h-4" />
          Teknik
        </button>
        <button
          id="tab-btn-attendance"
          onClick={() => setActiveTab('attendance')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'attendance' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Absensi
        </button>
        <button
          id="tab-btn-schedule"
          onClick={() => setActiveTab('schedule')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'schedule' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Jadwal
        </button>
        <button
          id="tab-btn-notifications"
          onClick={() => setActiveTab('notifications')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'notifications' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Notif
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-[#13131a]" />
          )}
        </button>
        <div className="w-[1px] h-8 bg-[#2a2a35] mx-2"></div>
        <button
          id="tab-btn-settings"
          onClick={() => setActiveTab('settings')}
          className={`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          Pengaturan
        </button>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#13131a] border-b border-[#2a2a35] text-white overflow-hidden relative z-40"
          >
            <div className="px-4 py-4 space-y-1 flex flex-col">
              {[
                { id: 'coaches', label: 'Pelatih', icon: Shield },
                { id: 'tutorials', label: 'Teknik & Video Tutorial', icon: Video },
                { id: 'attendance', label: 'Absensi Harian Murid', icon: FileSpreadsheet },
                { id: 'schedule', label: 'Jadwal Latihan Rutin', icon: Calendar },
                { id: 'notifications', label: 'Notifikasi Orang Tua', icon: MessageSquare }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`mobile-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center gap-3 transition-all ${
                      activeTab === item.id ? 'bg-gradient-to-r from-purple-900/40 to-orange-900/40 text-orange-500 border border-orange-500/30 font-bold' : 'hover:bg-[#1c1c28] text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-lg mx-auto md:max-w-none"
              id="dashboard-container"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  {/* Hero Banner for Dashboard */}
                  <div className="bg-gradient-to-r from-[#1c142c] to-[#0B0A10] border border-[#2a2a35] rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-purple-900/10">
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
                    
                    <div className="space-y-3 relative z-10 max-w-md text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Portal Manajemen Atlet
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-white leading-tight uppercase font-display">
                        Selamat Datang, <br />
                        <span className="text-orange-500">Coach Andi</span>
                      </h2>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Pantau grafik performa murid, presensi latihan harian, dan evaluasi skill di portal terpadu Dragon Basketball.
                      </p>
                    </div>
                  </div>

                  {/* Quick Navigation Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('stats')}
                      className="bg-[#13131a] hover:bg-[#1c1c28] border border-[#2a2a35] hover:border-orange-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center transition-colors">
                        <Users className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white uppercase tracking-widest text-center">Data Atlet</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="bg-[#13131a] hover:bg-[#1c1c28] border border-[#2a2a35] hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white uppercase tracking-widest text-center">Presensi Harian</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('report')}
                      className="bg-[#13131a] hover:bg-[#1c1c28] border border-[#2a2a35] hover:border-blue-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-colors">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white uppercase tracking-widest text-center">Rapor Evaluasi</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('coaches')}
                      className="bg-[#13131a] hover:bg-[#1c1c28] border border-[#2a2a35] hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-colors">
                        <Shield className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white uppercase tracking-widest text-center">Tim Pelatih</span>
                    </button>
                  </div>

              {/* Ringkasan Skuad Widget */}
              <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase">RINGKASAN SKUAD</h3>
                </div>
                
                <div className="flex divide-x divide-[#2a2a35] mb-6 relative z-10">
                  <div className="flex-1 pr-4">
                    <span className="text-[10px] text-slate-400 block mb-1">Total Atlet</span>
                    <span className="text-2xl font-black text-white">{students.length} <span className="text-sm font-medium text-slate-400">Murid</span></span>
                  </div>
                  <div className="flex-1 pl-4">
                    <span className="text-[10px] text-slate-400 block mb-1">Rata-rata Skor</span>
                    <span className="text-2xl font-black text-orange-500">{globalMetrics.avgScore} <span className="text-sm font-medium text-slate-400">/ 100</span></span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('stats')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-900/40 to-orange-900/40 border border-[#2a2a35] text-slate-300 hover:text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-orange-900/60"
                >
                  <Users className="w-4 h-4" />
                  LIHAT DETAIL SKUAD
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                
                {/* Background glow graphic */}
                <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none select-none">
                   <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-700 to-orange-500 blur-3xl"></div>
                </div>
              </div>

              {/* Evaluasi Terbaru List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">EVALUASI TERBARU</h3>
                  </div>
                  <button onClick={() => setActiveTab('report')} className="text-[11px] text-orange-500 hover:text-orange-400 font-medium flex items-center">
                    Lihat Semua <ArrowUpRight className="w-3 h-3 ml-1" />
                  </button>
                </div>

                <div className="space-y-3">
                  {students.slice(0, 3).map((student, idx) => {
                    const skillsArr = Object.values(student.skills) as number[];
                    const avg = Math.round(skillsArr.reduce((a, b) => a + b, 0) / 6);
                    const isOrange = idx % 2 === 0;
                    return (
                      <div key={student.id} className={`bg-[#13131a] border-l-4 ${isOrange ? 'border-l-orange-500' : 'border-l-blue-500'} border-t border-r border-b border-[#2a2a35] rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden`}>
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3 items-center">
                            <div className={`w-10 h-10 rounded-full border border-[#2a2a35] flex items-center justify-center font-bold text-sm ${isOrange ? 'text-orange-500' : 'text-blue-500'} bg-[#0B0A10]`}>
                              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm">{student.name}</h4>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isOrange ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' : 'border-blue-500/30 text-blue-500 bg-blue-500/10'} font-medium`}>
                                  {student.position}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {student.classLevel} • {student.age} Tahun • {student.height} cm • {student.weight} kg
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">Skor</span>
                            <span className={`text-xl font-black text-orange-500`}>{avg}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 flex items-start gap-1.5 bg-[#0B0A10]/50 p-2 rounded-lg border border-[#2a2a35]/50">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p>{student.notes || 'Catatan performa mingguan atlet terpantau stabil.'}</p>
                        </div>

                        <div className="grid grid-cols-5 gap-1 pt-1 pb-2">
                           <div className="flex gap-1 items-center justify-center"><span className="text-[10px] text-slate-500">Dribbling</span> <span className="text-[10px] font-bold text-orange-500">{student.skills.dribbling}</span></div>
                           <div className="flex gap-1 items-center justify-center"><span className="text-[10px] text-slate-500">Shooting</span> <span className="text-[10px] font-bold text-orange-500">{student.skills.shooting}</span></div>
                           <div className="flex gap-1 items-center justify-center"><span className="text-[10px] text-slate-500">Defense</span> <span className="text-[10px] font-bold text-purple-500">{student.skills.defense}</span></div>
                           <div className="flex gap-1 items-center justify-center"><span className="text-[10px] text-slate-500">Physical</span> <span className="text-[10px] font-bold text-emerald-500">{student.skills.physical}</span></div>
                           <div className="flex gap-1 items-center justify-center"><span className="text-[10px] text-slate-500">Passing</span> <span className="text-[10px] font-bold text-blue-500">{student.skills.passing}</span></div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            <span>12 Mei 2024</span>
                          </div>
                          <button onClick={() => { setSelectedStudentId(student.id); setActiveTab('stats'); }} className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 transition-all">
                            Lihat Detail <ArrowUpRight className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveTab('stats')}
                  className="w-full py-4 mt-2 rounded-2xl bg-[#13131a] border border-[#2a2a35] text-slate-300 hover:text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#1c1c28]"
                >
                  <Users className="w-4 h-4 text-purple-500" />
                  LIHAT SEMUA EVALUASI
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: TUTORIALS & VIDEO LIBRARY */}
          {activeTab === 'tutorials' && (
            <motion.div
              key="tutorials"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <TutorialViewer />
            </motion.div>
          )}

          {/* TAB 3: STUDENT SKILLS RATINGS */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <StudentStats
                students={students}
                selectedStudentId={selectedStudentId}
                onSelectStudent={setSelectedStudentId}
                onUpdateSkills={handleUpdateSkills}
                coaches={coaches}
                onUpdateStudent={handleUpdateStudent}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </motion.div>
          )}

          {/* TAB 4: STUDENT REPORT CARDS */}
          {activeTab === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick selector of student top bar inside reports */}
              <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Atlet Terpilih:</span>
                <select
                  id="select-report-student"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="text-xs font-bold border border-[#2a2a35] bg-[#1c1c28] text-white rounded-xl py-2 px-4 cursor-pointer outline-none focus:border-orange-500 transition-colors uppercase tracking-wider"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      Rapor untuk: {s.name} ({s.position})
                    </option>
                  ))}
                </select>
              </div>

              <ReportCard
                students={students}
                selectedStudentId={selectedStudentId}
                onSendNotification={handleSendNotification}
              />
            </motion.div>
          )}

          {/* TAB 5: DAILY ATTENDANCE */}
          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AttendanceManager
                students={students}
                onUpdateAttendance={handleUpdateAttendance}
                onSendNotification={handleSendNotification}
                coaches={coaches}
                onUpdateStudent={handleUpdateStudent}
              />
            </motion.div>
          )}

          {/* TAB 6: PRACTICE CALENDAR */}
          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ScheduleManager
                schedule={schedule}
                onAddPractice={handleAddPractice}
                onToggleCompletePractice={handleToggleCompletePractice}
              />
            </motion.div>
          )}

          {/* TAB 7: PARENT COMMUNICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationCenter
                students={students}
                notifications={notifications}
                onSendCustomNotification={handleSendCustomNotification}
                onClearLogs={handleClearNotifications}
              />
            </motion.div>
          )}

          {/* TAB: COACHES */}
          {activeTab === 'coaches' && (
            <motion.div
              key="coaches"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CoachManager
                coaches={coaches}
                onAddCoach={handleAddCoach}
                onUpdateCoach={handleUpdateCoach}
                onDeleteCoach={handleDeleteCoach}
              />
            </motion.div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Settings className="w-32 h-32 text-orange-500 transform rotate-12" />
                  </div>
                  
                  <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2 tracking-wide uppercase">
                    <Settings className="w-5 h-5 text-orange-500" />
                    Pengaturan Akademi
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-8 leading-relaxed font-medium">
                    Sesuaikan identitas visual dan informasi akademi yang akan ditampilkan pada header dan rapor siswa.
                  </p>

                  <div className="space-y-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Ikon Logo (Emoji)</label>
                          <input
                            type="text"
                            maxLength={2}
                            value={academySettings.logoIcon}
                            onChange={(e) => setAcademySettings({...academySettings, logoIcon: e.target.value})}
                            className="w-20 text-center text-xl p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Upload Logo Gambar</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 bg-[#1c1c28] border border-[#2a2a35] hover:border-orange-500 hover:bg-[#1c1c28]/80 text-white rounded-xl p-3 cursor-pointer transition-colors flex items-center justify-center gap-2">
                              <ImageIcon className="w-4 h-4 text-orange-500" />
                              <span className="text-xs font-bold">Pilih File Logo</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setAcademySettings({...academySettings, logoUrl: reader.result as string});
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {academySettings.logoUrl && (
                              <button 
                                onClick={() => setAcademySettings({...academySettings, logoUrl: ''})}
                                className="bg-red-500/10 text-red-500 border border-red-500/30 p-3 rounded-xl hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Upload Background Header</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 bg-[#1c1c28] border border-[#2a2a35] hover:border-orange-500 hover:bg-[#1c1c28]/80 text-white rounded-xl p-3 cursor-pointer transition-colors flex items-center justify-center gap-2">
                              <ImageIcon className="w-4 h-4 text-orange-500" />
                              <span className="text-xs font-bold">Pilih Background</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setAcademySettings({...academySettings, bannerUrl: reader.result as string});
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {academySettings.bannerUrl && (
                              <button 
                                onClick={() => setAcademySettings({...academySettings, bannerUrl: ''})}
                                className="bg-red-500/10 text-red-500 border border-red-500/30 p-3 rounded-xl hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Judul Utama</label>
                          <input
                            type="text"
                            value={academySettings.title}
                            onChange={(e) => setAcademySettings({...academySettings, title: e.target.value})}
                            className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Sub Judul</label>
                          <input
                            type="text"
                            value={academySettings.subtitle}
                            onChange={(e) => setAcademySettings({...academySettings, subtitle: e.target.value})}
                            className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Lokasi</label>
                          <input
                            type="text"
                            value={academySettings.location}
                            onChange={(e) => setAcademySettings({...academySettings, location: e.target.value})}
                            className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0A10] border-t border-[#2a2a35] text-slate-400 py-8 relative z-20 pb-32 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center gap-4 text-center">
          <div className="space-y-1">
            <span className="text-white text-xs font-black uppercase tracking-wider block font-display">BASKETBALL ACADEMY PORTAL</span>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              Materi bola basket terpadu, presensi digital modern, parameter skill 3D real-time, & gerbang komunikasi wali murid.<br/>
              Sistem bermitra FIBA Youth Coach Assistant & Authenticity Lab.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-medium space-y-1">
            <span>© 2026 Basketball Academy. Seluruh Hak Cipta Dilindungi.</span>
            <div className="flex gap-2 justify-center text-orange-500 font-bold">
              <a href="#privacy" className="hover:text-orange-400">Kebijakan Privasi</a>
              <span>•</span>
              <a href="#terms" className="hover:text-orange-400">Ketentuan Layanan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-[#13131a]/95 backdrop-blur-md border border-[#2a2a35] rounded-2xl flex justify-around items-center py-2 px-2 z-50 shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'dashboard' ? 'text-orange-500' : 'text-slate-500'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Beranda</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'stats' ? 'text-orange-500' : 'text-slate-500'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-bold">Atlet</span>
        </button>
        
        {/* Center Add Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button 
            onClick={() => { setActiveTab('stats'); setTimeout(() => window.dispatchEvent(new CustomEvent('openAddStudentModal')), 150) }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center border-4 border-[#0B0A10] text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          >
            <Plus className="w-6 h-6" />
          </button>
          <span className="text-[9px] text-slate-400 font-bold absolute -bottom-4 w-20 text-center">Tambah Atlet</span>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'report' ? 'text-orange-500' : 'text-slate-500'}`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] font-bold">Ranking</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'settings' ? 'text-orange-500' : 'text-slate-500'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-bold">Pengaturan</span>
        </button>
      </div>

    </div>
  );
}
