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
import { SavedCards } from './components/SavedCards';
import { SavedCard } from './types';
import ReportCard from './components/ReportCard';
import TutorialViewer from './components/TutorialViewer';
import AttendanceManager from './components/AttendanceManager';
import ScheduleManager from './components/ScheduleManager';
import NotificationCenter from './components/NotificationCenter';
import CardGenerator from './components/CardGenerator';

// Icons
import { Search, Sun, Moon, Trophy,
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
  MapPin,
  ExternalLink,
  Download,
  Trash2,
  Edit3,
  Image
 , UserPlus, BookOpen} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, signInWithGoogle, logout } = useAuth();

  const SidebarButton = ({ id, icon, label, badge }: { id: any, icon: any, label: string, badge?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center justify-between transition-all ${
        activeTab === id ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-blue-500 border border-blue-500/30 font-bold' : 'hover:neu-flat-sm text-secondary border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {!!badge && badge > 0 && (
        <span className="bg-red-500 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </button>
  );

  
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
      location: 'Banyuwangi, East Java',
      whatsappNumber: ''
    };
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_1');
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [importedCoachIds, setImportedCoachIds] = useState<string[]>([]);
  const [showImportedCoaches, setShowImportedCoaches] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutorials' | 'stats' | 'report' | 'attendance' | 'schedule' | 'notifications' | 'settings' | 'coaches' | 'generator-coach' | 'generator-athlete' | 'generator-student' | 'saved-cards'>('stats');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hoop_portal_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('hoop_portal_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  useFirebaseSync(setStudents, setSchedule, setNotifications, setCoaches);

  
  useEffect(() => {
    localStorage.setItem('hoop_portal_imported_coaches', JSON.stringify(importedCoachIds));
  }, [importedCoachIds]);

  useEffect(() => {
    const stored = localStorage.getItem('hoop_portal_imported_coaches');
    if (stored) {
      try { setImportedCoachIds(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

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

  // Handle cross-origin messages from the Generator Iframe (Cara 1)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for message from the generator
      if (event.data && (event.data.type === 'IMPORT_COACH' || event.data.action === 'export-coach')) {
        const payload = event.data.payload || event.data.data;
        if (payload && payload.name) {
          const newCoach: import('./types').Coach = {
            id: payload.id || `coach_${Date.now()}`,
            name: payload.name,
            role: payload.role || payload.jabatan || 'Pelatih',
            avatar: payload.avatar || payload.photo || '👤',
            specialty: payload.specialty || payload.spesialisasi || 'Umum',
            experience: payload.experience || payload.pengalaman || '5 Tahun',
            certification: payload.certification || payload.sertifikasi || 'Nasional'
          };
          
          setCoaches(prev => {
            const isExist = prev.some(c => c.id === newCoach.id);
            if (isExist) return prev; // Prevent duplicate if same ID
            const next = [...prev, newCoach];
            syncCoachToFirebase(newCoach);
            return next;
          });
          alert(`Berhasil mengimpor pelatih: ${newCoach.name}`);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


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

    const fullMessage = `${message}\n\nSalam,\n${academySettings.title}\nWA: ${academySettings.whatsappNumber || '-'}`;

    const newNotif: ParentNotification = {
      id: `notif_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      title,
      message: fullMessage,
      timestamp: new Date().toISOString(),
      type,
      channel: 'WhatsApp',
      status: 'sent'
    };
    
    if (user) syncNotificationToFirebase(newNotif);
    setNotifications(prev => [newNotif, ...prev]);

    // Open WhatsApp URL if parent has phone number
    if (student.parentPhone) {
      const waNumber = student.parentPhone.replace(/\D/g, '');
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleSendCustomNotification = (notif: Omit<ParentNotification, 'id' | 'timestamp' | 'status'>) => {
    
    const fullMessage = `${notif.message}\n\nSalam,\n${academySettings.title}\nWA: ${academySettings.whatsappNumber || '-'}`;
    
    const newNotif: ParentNotification = {
      ...notif,
      message: fullMessage,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    if (user) syncNotificationToFirebase(newNotif);
    setNotifications(prev => [newNotif, ...prev]);

    // Open WhatsApp URL if channel is WhatsApp and parent has phone number
    if (notif.channel === 'WhatsApp' && notif.parentPhone) {
      const waNumber = notif.parentPhone.replace(/\D/g, '');
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;
      window.open(waUrl, '_blank');
    }
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
    <div className="min-h-screen font-sans flex antialiased bg-soft-gradient text-primary relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen bg-secondary/95 backdrop-blur-md border-r border-theme z-50 relative shrink-0">
        <div className="p-6 border-b border-theme flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/50 rounded-xl flex items-center justify-center border border-theme overflow-hidden shrink-0 shadow-lg">
               {academySettings.logoUrl ? (
                 <img src={academySettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
               ) : (
                 academySettings.logoIcon
               )}
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <h1 className="text-sm font-black uppercase tracking-tight text-primary truncate">
                {academySettings.title}
              </h1>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 truncate">
                {academySettings.subtitle}
              </h2>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          <div>
            <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Menu Utama</h3>
            <div className="space-y-1">
              <SidebarButton id="dashboard" icon={<Home className="w-4 h-4" />} label="Beranda" />
              <SidebarButton id="stats" icon={<Users className="w-4 h-4" />} label="Data Atlet" />
              <SidebarButton id="attendance" icon={<FileSpreadsheet className="w-4 h-4" />} label="Absensi" />
              <SidebarButton id="schedule" icon={<Calendar className="w-4 h-4" />} label="Jadwal" />
              <SidebarButton id="report" icon={<Trophy className="w-4 h-4" />} label="Rapor & Ranking" />
              <SidebarButton id="tutorials" icon={<Video className="w-4 h-4" />} label="Video & Teknik" />
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Pelatih</h3>
            <div className="space-y-1">
              <SidebarButton id="coaches" icon={<User className="w-4 h-4" />} label="Data Pelatih" />
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Tools & Generator</h3>
            <div className="space-y-1">
              <SidebarButton id="notifications" icon={<MessageSquare className="w-4 h-4" />} label="Notifikasi" badge={notifications.length} />
              <SidebarButton id="generator-student" icon={<Image className="w-4 h-4" />} label="Gen. Kartu Siswa" />
              <SidebarButton id="generator-athlete" icon={<ImageIcon className="w-4 h-4" />} label="Gen. Kartu Atlet" />
              <SidebarButton id="generator-coach" icon={<User className="w-4 h-4" />} label="Gen. Kartu Pelatih" />
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Sistem</h3>
            <div className="space-y-1">
              <SidebarButton id="settings" icon={<Settings className="w-4 h-4" />} label="Pengaturan Akademi" />
            </div>
          </div>
        </div>

      
        <div className="p-4 border-t border-theme">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center justify-between transition-all hover:bg-secondary/80 text-secondary border border-transparent neu-button"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </div>
          </button>
        </div>

      </aside>

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0 split-bg">

      {/* Mobile Header */}
        <header className="bg-secondary/80 backdrop-blur-md relative z-40 w-full flex flex-col justify-center border-b border-theme lg:hidden shrink-0">
            {academySettings.bannerUrl && (
              <div className="absolute inset-0 z-0">
                <img src={academySettings.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] to-transparent"></div>
              </div>
            )}
            <div className="w-full flex items-center justify-between relative px-4 py-4 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/50 rounded-xl flex items-center justify-center border border-theme overflow-hidden shrink-0 shadow-lg">
                    {academySettings.logoUrl ? (
                        <img src={academySettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1.5" />
                    ) : (
                        academySettings.logoIcon
                    )}
                    </div>
                    <div className="flex flex-col justify-center">
                    <h1 className="text-sm font-black uppercase tracking-tight text-primary leading-none">
                        {academySettings.title}
                    </h1>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-1">
                        {academySettings.subtitle}
                    </h2>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Scrolling Area */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar relative">
          {academySettings.bannerUrl && activeTab === 'dashboard' && (
             <div className="hidden lg:block w-full h-64 relative border-b border-theme shrink-0">
                 <img src={academySettings.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-40" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] to-transparent"></div>
             </div>
          )}
          <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 relative min-h-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-lg mx-auto md:max-w-none pb-20"
              id="dashboard-container"
            >
              <div className="relative z-10 space-y-8">
                {/* Header Greeting */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight font-display tracking-tight">
                      Hi, <span className="text-blue-500">Coach Andi!</span>
                    </h2>
                    <p className="text-sm text-secondary font-medium mt-1">
                      Let's learn something new today!
                    </p>
                  </div>
                  
                                    {/* Search Bar */}
                  <div className="w-full md:w-auto relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search for tools..." 
                      className="w-full md:w-72 pl-11 pr-4 py-3.5 rounded-full bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Categories Title */}
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-primary tracking-wide">Categories</h3>
                  <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">View All</button>
                </div>

                                {/* Grid Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { id: 'generator-student', label: 'Form Siswa Baru', subtitle: 'Pendaftaran', icon: <UserPlus className="w-7 h-7 text-white" />, color: 'from-[#ff8f71] to-[#ff3e5e]' },
                    { id: 'stats', label: 'Data Siswa & Kelas', subtitle: 'ID Card Siswa', icon: <Users className="w-7 h-7 text-white" />, color: 'from-[#71a0ff] to-[#3e68ff]' },
                    { id: 'schedule', label: 'Jadwal Latihan', subtitle: 'Kalender Sesi', icon: <Calendar className="w-7 h-7 text-white" />, color: 'from-[#42e8e0] to-[#0ea5e9]' },
                    { id: 'tutorials', label: 'Materi', subtitle: 'Video & Artikel', icon: <BookOpen className="w-7 h-7 text-white" />, color: 'from-[#c084fc] to-[#9333ea]' },
                    { id: 'attendance', label: 'Penilaian & Absensi', subtitle: 'Kehadiran', icon: <FileSpreadsheet className="w-7 h-7 text-white" />, color: 'from-[#ffb071] to-[#ff713e]' },
                    { id: 'generator-athlete', label: 'Form & Kartu Atlet', subtitle: 'Manajemen Atlet', icon: <Award className="w-7 h-7 text-white" />, color: 'from-[#38bdf8] to-[#0284c7]' },
                    { id: 'report', label: 'Raport', subtitle: 'Evaluasi', icon: <Trophy className="w-7 h-7 text-white" />, color: 'from-[#fbbf24] to-[#d97706]' },
                    { id: 'generator-coach', label: 'Generator Coach', subtitle: 'ID Card Coach', icon: <Shield className="w-7 h-7 text-white" />, color: 'from-[#f43f5e] to-[#be123c]' },
                    { id: 'coaches', label: 'Daftar Coach', subtitle: 'Direktori', icon: <User className="w-7 h-7 text-white" />, color: 'from-[#818cf8] to-[#4f46e5]' },
                    { id: 'notifications', label: 'Notifikasi', subtitle: 'Pesan Baru', icon: <Bell className="w-7 h-7 text-white" />, color: 'from-[#a78bfa] to-[#7c3aed]' }
                  ].map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id as any)}
                      className="bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-white/5"
                    >
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                        {cat.icon}
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="text-sm md:text-base font-bold text-slate-800 dark:text-white block leading-tight">{cat.label}</span>
                        <span className="text-[11px] md:text-xs text-slate-500 font-medium">{cat.subtitle}</span>
                      </div>
                    </button>
                  ))}
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
              onSaveCard={(card) => {
                setSavedCards([...savedCards, card]);
              }}
              savedCards={savedCards}
              onImportCard={(studentId, cardId) => {
                const card = savedCards.find(c => c.id === cardId);
                if (card) {
                  // Update student info with imported card info
                  handleUpdateStudent(studentId, {
                    name: card.name,
                    position: card.position as any,
                    height: card.height,
                    weight: card.weight,
                    avatar: card.avatar,
                    fullBodyPhoto: card.fullBodyPhoto,
                    parentName: card.parentName,
                    parentPhone: card.parentPhone
                  });
                  alert(`Kartu "${card.name}" berhasil diimport!`);
                }
              }}
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
              <div className="neu-flat p-5 shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-widest block">Atlet Terpilih:</span>
                <select
                  id="select-report-student"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="text-xs font-bold border border-theme neu-pressed text-primary rounded-xl py-2 px-4 cursor-pointer outline-none focus:border-blue-500 transition-colors uppercase tracking-wider"
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
                savedCards={savedCards}
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
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="neu-flat p-6 md:p-8 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-primary uppercase tracking-wider flex items-center gap-2"><User className="w-6 h-6 text-blue-500" /> Daftar Pelatih</h2>
                    
                    <div className="relative group">
                      <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-primary font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-opacity text-xs uppercase tracking-widest shadow-lg cursor-pointer">
                        <Download className="w-4 h-4" /> Import Kartu
                      </button>
                      
                      <div className="absolute right-0 top-full mt-2 w-56 neu-pressed border border-theme rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="max-h-64 overflow-y-auto">
                          {coaches.filter(c => !importedCoachIds.includes(c.id)).map(coach => (
                            <button
                              key={coach.id}
                              onClick={() => setImportedCoachIds([...importedCoachIds, coach.id])}
                              className="w-full text-left px-4 py-3 text-xs text-slate-300 hover:bg-secondary border-theme hover:text-primary transition-colors border-b border-theme last:border-0 flex items-center gap-3"
                            >
                              <span className="text-lg">{coach.avatar || '👤'}</span>
                              <span className="truncate">{coach.name}</span>
                            </button>
                          ))}
                          {coaches.filter(c => !importedCoachIds.includes(c.id)).length === 0 && (
                            <div className="px-4 py-4 text-xs text-secondary text-center">Semua coach sudah diimport.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {coaches.filter(c => importedCoachIds.includes(c.id)).map(coach => (
                      <div key={coach.id} className="relative group rounded-3xl overflow-hidden border border-theme neu-pressed aspect-[900/550] shadow-xl">
                        {coach.avatar?.startsWith('http') || coach.avatar?.startsWith('data:') ? (
                          <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1c1c28] to-[#13131a]">
                            <div className="text-5xl mb-4">{coach.avatar || '👤'}</div>
                            <h3 className="text-primary font-bold text-xl">{coach.name}</h3>
                            <p className="text-blue-500 text-sm font-bold uppercase tracking-widest mt-2">{coach.role}</p>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm z-10">
                          <a href={`https://creative-id-hub.vercel.app/?id=${coach.id}`} target="_blank" rel="noopener noreferrer" className="neu-button-accent p-3.5 rounded-2xl transition-colors shadow-lg" title="Edit Kartu">
                            <Edit3 className="w-6 h-6" />
                          </a>
                          <button onClick={() => {
                            if (confirm(`Hapus kartu pelatih ${coach.name} dari halaman ini?`)) {
                              setImportedCoachIds(importedCoachIds.filter(id => id !== coach.id));
                            }
                          }} className="bg-red-500 hover:bg-red-600 text-primary p-3.5 rounded-2xl transition-colors shadow-lg" title="Hapus Kartu">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          
          {/* TAB: GENERATOR COACH */}
          {activeTab === 'generator-coach' && (
            <motion.div
              key="generator-coach"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-160px)] min-h-[600px] w-full"
            >
              <div className="max-w-7xl mx-auto h-full space-y-6">
                <div className="neu-flat h-full shadow-lg overflow-hidden flex flex-col">
                  <CardGenerator type="coach" title="Kartu Pelatih" />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GENERATOR STUDENT */}
          {activeTab === 'generator-student' && (
            <motion.div
              key="generator-student"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-160px)] min-h-[600px] w-full"
            >
              <div className="max-w-7xl mx-auto h-full space-y-6">
                <div className="neu-flat h-full shadow-lg overflow-hidden flex flex-col">
                  <CardGenerator type="student" title="Kartu Siswa" />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GENERATOR ATHLETE */}
          {activeTab === 'generator-athlete' && (
            <motion.div
              key="generator-athlete"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-160px)] min-h-[600px] w-full"
            >
              <div className="max-w-7xl mx-auto h-full space-y-6">
                <div className="neu-flat h-full shadow-lg overflow-hidden flex flex-col">
                  <CardGenerator type="student" title="Kartu Atlet" />
                </div>
              </div>
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
                <div className="neu-flat p-6 md:p-8 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Settings className="w-32 h-32 text-blue-500 transform rotate-12" />
                  </div>
                  
                  <h4 className="text-sm font-black text-primary mb-2 flex items-center gap-2 tracking-wide uppercase">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Pengaturan Akademi
                  </h4>
                  <p className="text-[11px] text-secondary mb-8 leading-relaxed font-medium">
                    Sesuaikan identitas visual dan informasi akademi yang akan ditampilkan pada header dan rapor siswa.
                  </p>

                  <div className="space-y-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Ikon Logo (Emoji)</label>
                          <input
                            type="text"
                            maxLength={2}
                            value={academySettings.logoIcon}
                            onChange={(e) => setAcademySettings({...academySettings, logoIcon: e.target.value})}
                            className="w-20 text-center text-xl p-3 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Upload Logo Gambar</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 neu-pressed border border-theme hover:border-blue-500 hover:neu-flat-sm/80 text-primary rounded-xl p-3 cursor-pointer transition-colors flex items-center justify-center gap-2">
                              <ImageIcon className="w-4 h-4 text-blue-500" />
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
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Upload Background Header</label>
                          <div className="flex items-center gap-3">
                            <label className="flex-1 neu-pressed border border-theme hover:border-blue-500 hover:neu-flat-sm/80 text-primary rounded-xl p-3 cursor-pointer transition-colors flex items-center justify-center gap-2">
                              <ImageIcon className="w-4 h-4 text-blue-500" />
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
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Judul Utama</label>
                          <input
                            type="text"
                            value={academySettings.title}
                            onChange={(e) => setAcademySettings({...academySettings, title: e.target.value})}
                            className="w-full text-xs p-3 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Sub Judul</label>
                          <input
                            type="text"
                            value={academySettings.subtitle}
                            onChange={(e) => setAcademySettings({...academySettings, subtitle: e.target.value})}
                            className="w-full text-xs p-3 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Lokasi</label>
                          <input
                            type="text"
                            value={academySettings.location}
                            onChange={(e) => setAcademySettings({...academySettings, location: e.target.value})}
                            className="w-full text-xs p-3 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Nomor WhatsApp Notifikasi (Format: 628...)</label>
                          <input
                            type="text"
                            value={academySettings.whatsappNumber || ''}
                            onChange={(e) => setAcademySettings({...academySettings, whatsappNumber: e.target.value})}
                            placeholder="Contoh: 6281234567890"
                            className="w-full text-xs p-3 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500 transition-colors"
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
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-secondary border-r border-theme text-primary z-50 flex flex-col"
          >
            <div className="p-4 border-b border-theme flex justify-between items-center">
               <span className="font-bold uppercase tracking-widest text-sm text-secondary">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-secondary border-theme rounded-xl text-secondary">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Menu Utama</h3>
                  <div className="space-y-1">
                    <SidebarButton id="dashboard" icon={<Home className="w-4 h-4" />} label="Beranda" />
                    <SidebarButton id="stats" icon={<Users className="w-4 h-4" />} label="Data Atlet" />
                    <SidebarButton id="attendance" icon={<FileSpreadsheet className="w-4 h-4" />} label="Absensi" />
                    <SidebarButton id="schedule" icon={<Calendar className="w-4 h-4" />} label="Jadwal" />
                    <SidebarButton id="report" icon={<Trophy className="w-4 h-4" />} label="Rapor" />
                    <SidebarButton id="tutorials" icon={<Video className="w-4 h-4" />} label="Teknik" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Pelatih & Tools</h3>
                  <div className="space-y-1">
                    <SidebarButton id="coaches" icon={<User className="w-4 h-4" />} label="Data Pelatih" />
                    <SidebarButton id="notifications" icon={<MessageSquare className="w-4 h-4" />} label="Notifikasi" badge={notifications.length} />
                    <SidebarButton id="generator-student" icon={<Image className="w-4 h-4" />} label="Gen. Kartu Siswa" />
                    <SidebarButton id="generator-athlete" icon={<ImageIcon className="w-4 h-4" />} label="Gen. Kartu Atlet" />
                    <SidebarButton id="generator-coach" icon={<User className="w-4 h-4" />} label="Gen. Kartu Pelatih" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 px-2">Sistem</h3>
                  <div className="space-y-1">
                    <SidebarButton id="settings" icon={<Settings className="w-4 h-4" />} label="Pengaturan" />
                  </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 neu-flat flex justify-around items-center py-2 px-2 z-50 shadow-2xl">
        <button
          onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-secondary'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Beranda</span>
        </button>
        <button
          onClick={() => { setActiveTab('stats'); setIsMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'stats' ? 'text-blue-500' : 'text-secondary'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-bold">Atlet</span>
        </button>
        
        {/* Menu Toggle Button in Center */}
        <div className="relative -top-5 flex flex-col items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1c1c28] to-[#13131a] flex items-center justify-center border-4 border-[#0B0A10] text-blue-500 shadow-xl hover:text-blue-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-[9px] text-secondary font-bold absolute -bottom-4 w-20 text-center">Menu</span>
        </div>

        <button
          onClick={() => { setActiveTab('report'); setIsMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'report' ? 'text-blue-500' : 'text-secondary'}`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] font-bold">Rapor</span>
        </button>
        <button
          onClick={() => { setActiveTab('attendance'); setIsMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 ${activeTab === 'attendance' ? 'text-blue-500' : 'text-secondary'}`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[9px] font-bold">Absensi</span>
        </button>
      </div>
    </div>
  );
}
