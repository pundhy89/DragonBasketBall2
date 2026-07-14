/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Student, StudentSkills, Coach } from '../types';
import {
  Download,
  Shield,
  Sparkles,
  Trophy,
  User,
  Heart,
  Users,
  Activity,
  ChevronRight,
  Sliders,
  Edit3,
  Check,
  Plus,
  Trash2,
  Filter,
  X,
  UserPlus,
  Calendar,
  Ruler,
  Scale,
  UserRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentStatsProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onUpdateSkills: (studentId: string, skills: StudentSkills, notes: string, evaluatedBy?: string) => void;
  coaches: Coach[];
  onAddStudent: (student: Omit<Student, 'id' | 'attendanceHistory'>) => void;
  onUpdateStudent: (id: string, student: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
  onSaveCard?: (cardData: any) => void;
  savedCards?: any[];
  onImportCard?: (studentId: string, cardId: string) => void;
}

const CLASS_LEVELS = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'] as const;
const BASKETBALL_POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'] as const;
const EMOJI_AVATARS = ['🏀', '⚡', '🔥', '🛡️', '👟', '🌟', '👶', '🧒', '👧', '🦁', '🦊', '🦅', '🦈'];

export default function StudentStats({
  students,
  savedCards = [],
  onImportCard,
  onSaveCard,
  selectedStudentId,
  onSelectStudent,
  onUpdateSkills,
  coaches,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}: StudentStatsProps) {
  
  // Safe Selection Fallback
  const student = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkills, setEditedSkills] = useState<StudentSkills>({
    dribbling: 60,
    shooting: 60,
    passing: 60,
    defense: 60,
    physical: 60,
    teamwork: 60
  });
  const [editedNotes, setEditedNotes] = useState('');
  const [editedEvaluator, setEditedEvaluator] = useState('c_1');
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  // Class filtration state
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Student form visibility and values
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    age: 11,
    height: 145,
    weight: 38,
    position: 'Point Guard' as typeof BASKETBALL_POSITIONS[number],
    classLevel: 'SD Berkembang' as typeof CLASS_LEVELS[number],
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    avatar: '',
    fullBodyPhoto: '',
    notes: '',
    evaluatedBy: 'c_1'
  });

  React.useEffect(() => {
    const handleOpenModal = () => {
      setEditingStudentId(null);
      setNewStudentForm({
        name: '',
        age: 11,
        height: 145,
        weight: 38,
        position: 'Point Guard',
        classLevel: 'SD Berkembang',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        avatar: '',
        fullBodyPhoto: '',
        notes: '',
        evaluatedBy: 'c_1'
      });
      setIsAddingStudent(true);
    };

    window.addEventListener('openAddStudentModal', handleOpenModal);
    return () => window.removeEventListener('openAddStudentModal', handleOpenModal);
  }, []);

  // Sync state when student selection changes
  React.useEffect(() => {
    if (student) {
      setEditedSkills({ ...student.skills });
      setEditedNotes(student.notes);
      setEditedEvaluator(student.evaluatedBy || 'c_1');
    }
    setIsEditing(false);
  }, [student]);

  const handleSliderChange = (skill: keyof StudentSkills, value: number) => {
    setEditedSkills(prev => ({
      ...prev,
      [skill]: value
    }));
  };

  const handleSave = () => {
    if (student) {
      onUpdateSkills(student.id, editedSkills, editedNotes, editedEvaluator);
    }
    setIsEditing(false);
  };

  const currentSkills = isEditing ? editedSkills : (student?.skills || {
    dribbling: 50,
    shooting: 50,
    passing: 50,
    defense: 50,
    physical: 50,
    teamwork: 50
  });

  // Filter & Sort Students: Smallest class level to largest class level
  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (selectedClassFilter !== 'All') {
      list = list.filter(s => s.classLevel === selectedClassFilter);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }

    const classOrderValue: Record<string, number> = {
      'SD Lower': 1,
      'SD Berkembang': 2,
      'SD Upper': 3,
      'SMP': 4,
      'SMA': 5
    };

    return list.sort((a, b) => {
      const orderDiff = (classOrderValue[a.classLevel] || 0) - (classOrderValue[b.classLevel] || 0);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name); // Secondary alphabetical sort
    });
  }, [students, selectedClassFilter, searchQuery]);

  // Find Coach details
  const activeEvaluator = useMemo(() => {
    const evalId = isEditing ? editedEvaluator : (student?.evaluatedBy || 'c_1');
    return coaches.find(c => c.id === evalId) || coaches[0] || { id: 'fallback', name: 'Unknown Coach', role: 'Coach', avatar: '👤', specialty: '-' } as Coach;
  }, [coaches, student, isEditing, editedEvaluator]);

  // Radar Chart Calculations (300x300 viewBox, center 150, 150, max radius 100)
  const skillsKeys: { key: keyof StudentSkills; label: string; icon: any; color: string }[] = [
    { key: 'dribbling', label: 'Dribbling', icon: Sparkles, color: 'text-amber-500' },
    { key: 'shooting', label: 'Shooting', icon: Trophy, color: 'text-blue-500' },
    { key: 'passing', label: 'Passing', icon: ChevronRight, color: 'text-yellow-500' },
    { key: 'defense', label: 'Defense', icon: Shield, color: 'text-blue-500' },
    { key: 'physical', label: 'Physical', icon: Heart, color: 'text-red-500' },
    { key: 'teamwork', label: 'Teamwork', icon: Users, color: 'text-emerald-500' }
  ];

  const radarPoints = useMemo(() => {
    const center = 150;
    const rMax = 100;
    
    return skillsKeys.map((item, index) => {
      const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2; // start at top (90 deg)
      const score = currentSkills[item.key] || 50;
      const r = (score / 100) * rMax;
      
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      
      const webX = center + rMax * Math.cos(angle);
      const webY = center + rMax * Math.sin(angle);
      
      return {
        key: item.key,
        label: item.label,
        score,
        x,
        y,
        webX,
        webY,
        angle
      };
    });
  }, [currentSkills]);

  // Generate SVG Polygon path
  const polygonPath = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Average Score
  const averageScore = useMemo(() => {
    const total = (Object.values(currentSkills) as number[]).reduce((a, b) => a + b, 0);
    return Math.round((total / 6) * 10) / 10;
  }, [currentSkills]);

  // Attendance rate
  const attendanceRate = useMemo(() => {
    if (!student || !student.attendanceHistory) return 100;
    const history = Object.values(student.attendanceHistory);
    if (history.length === 0) return 100;
    const attended = history.filter(status => status === 'present' || status === 'late').length;
    return Math.round((attended / history.length) * 100);
  }, [student]);

  // Generate letter grade
  const letterGrade = useMemo(() => {
    if (averageScore >= 85) return { grade: 'A', text: 'Sangat Baik', color: 'bg-emerald-500 text-primary border-emerald-600 shadow-[0_4px_0_0_#059669]' };
    if (averageScore >= 75) return { grade: 'B', text: 'Baik', color: 'bg-amber-500 text-slate-950 border-amber-600 shadow-[0_4px_0_0_#d97706]' };
    if (averageScore >= 60) return { grade: 'C', text: 'Cukup', color: 'bg-yellow-400 text-slate-950 border-yellow-500 shadow-[0_4px_0_0_#ca8a04]' };
    return { grade: 'D', text: 'Butuh Latihan', color: 'bg-red-500 text-primary border-red-600 shadow-[0_4px_0_0_#dc2626]' };
  }, [averageScore]);

  // Form Submission
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim()) return;

    if (editingStudentId) {
      onUpdateStudent(editingStudentId, {
        name: newStudentForm.name,
        avatar: newStudentForm.avatar,
        fullBodyPhoto: newStudentForm.fullBodyPhoto,
        age: Number(newStudentForm.age),
        height: Number(newStudentForm.height),
        weight: Number(newStudentForm.weight),
        position: newStudentForm.position,
        parentName: newStudentForm.parentName,
        parentPhone: newStudentForm.parentPhone,
        parentEmail: newStudentForm.parentEmail,
        notes: newStudentForm.notes,
        classLevel: newStudentForm.classLevel,
        evaluatedBy: newStudentForm.evaluatedBy
      });
    } else {
      // Define initial baseline skills based on class level (slightly lower for kids)
      const baseSkill = newStudentForm.classLevel === 'SD Lower' ? 45 : newStudentForm.classLevel === 'SD Berkembang' ? 55 : 65;

      const initialSkills: StudentSkills = {
        dribbling: baseSkill,
        shooting: baseSkill - 5,
        passing: baseSkill + 5,
        defense: baseSkill,
        physical: baseSkill,
        teamwork: baseSkill + 10
      };

      onAddStudent({
        name: newStudentForm.name,
        avatar: newStudentForm.avatar,
        fullBodyPhoto: newStudentForm.fullBodyPhoto,
        age: Number(newStudentForm.age),
        height: Number(newStudentForm.height),
        weight: Number(newStudentForm.weight),
        position: newStudentForm.position,
        parentName: newStudentForm.parentName || 'Orang Tua ' + newStudentForm.name,
        parentPhone: newStudentForm.parentPhone || '0812-xxxx-xxxx',
        parentEmail: newStudentForm.parentEmail || (newStudentForm.name.toLowerCase().replace(/\s/g, '') + '@email.com'),
        skills: initialSkills,
        notes: newStudentForm.notes || 'Siswa baru kelas ' + newStudentForm.classLevel + '. Baru bergabung dengan akademi.',
        classLevel: newStudentForm.classLevel,
        evaluatedBy: newStudentForm.evaluatedBy
      });
    }

    // Reset Form
    setNewStudentForm({
      name: '',
      age: 11,
      height: 145,
      weight: 38,
      position: 'Point Guard',
      classLevel: 'SD Berkembang',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      avatar: '',
      fullBodyPhoto: '',
      notes: '',
      evaluatedBy: 'c_1'
    });

    setIsAddingStudent(false);
    setEditingStudentId(null);
  };

  return (
    <div className="w-full" id="stats-dashboard">
          {/* Form Create / Edit Student (Modal) */}
          {createPortal(
            <AnimatePresence>
              {isAddingStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setIsAddingStudent(false)}
                  />
                <motion.form
                  onSubmit={handleSaveStudent}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-primary border border-blue-500/30 rounded-2xl p-5 md:p-6 w-full max-w-lg shadow-2xl space-y-4 text-xs text-slate-300 max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
                >
                  <div className="flex justify-between items-center border-b border-theme pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      {editingStudentId ? <Edit3 className="w-4 h-4 text-blue-500" /> : <UserPlus className="w-4 h-4 text-blue-500" />}
                      <span className="font-bold text-primary uppercase text-[11px] tracking-widest">
                        {editingStudentId ? 'EDIT DATA SISWA' : 'FORMULIR SISWA BARU'}
                      </span>
                    </div>
                    <button type="button" onClick={() => setIsAddingStudent(false)} className="text-secondary hover:text-primary transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="font-medium text-secondary block text-[11px]">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rian Perkasa"
                      value={newStudentForm.name}
                      onChange={(e) => setNewStudentForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-theme neu-pressed text-primary outline-none focus:border-blue-500/50"
                    />
                  </div>

                  {/* Grid for parameters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Umur (Thn)</label>
                      <input
                        type="number"
                        min="6"
                        max="19"
                        value={newStudentForm.age}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                        className="w-full text-xs p-2 rounded-xl border border-theme neu-pressed text-primary"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Tinggi (cm)</label>
                      <input
                        type="number"
                        min="100"
                        max="220"
                        value={newStudentForm.height}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, height: Number(e.target.value) }))}
                        className="w-full text-xs p-2 rounded-xl border border-theme neu-pressed text-primary"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Berat (kg)</label>
                      <input
                        type="number"
                        min="20"
                        max="120"
                        value={newStudentForm.weight}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                        className="w-full text-xs p-2 rounded-xl border border-theme neu-pressed text-primary"
                      />
                    </div>
                  </div>

                  {/* Grid for class division & position */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Tingkat Kelas</label>
                      <select
                        value={newStudentForm.classLevel}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, classLevel: e.target.value as any }))}
                        className="w-full text-[11px] p-2 rounded-xl border border-theme neu-pressed text-primary font-bold cursor-pointer"
                      >
                        {CLASS_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Posisi Bermain</label>
                      <select
                        value={newStudentForm.position}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, position: e.target.value as any }))}
                        className="w-full text-[11px] p-2 rounded-xl border border-theme neu-pressed text-primary font-medium cursor-pointer"
                      >
                        {BASKETBALL_POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Parent Contact */}
                  <div className="space-y-2 border-t border-theme pt-3 mt-3">
                    <span className="font-bold text-blue-500 block text-[10px] uppercase tracking-widest">Kontak Wali / Orang Tua</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Nama Orang Tua"
                          value={newStudentForm.parentName}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, parentName: e.target.value }))}
                          className="w-full text-xs p-2.5 rounded-xl border border-theme neu-pressed text-primary placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="No. WhatsApp"
                          value={newStudentForm.parentPhone}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                          className="w-full text-xs p-2.5 rounded-xl border border-theme neu-pressed text-primary placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo URLs / File Uploads */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Foto Wajah (URL / Upload) *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/foto-wajah.jpg (atau upload)"
                          value={newStudentForm.avatar}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, avatar: e.target.value }))}
                          className="flex-1 min-w-0 text-xs p-2.5 rounded-xl border border-theme neu-pressed text-primary placeholder-slate-500 outline-none focus:border-blue-500/50"
                        />
                        <input 
                          type="file" 
                          id="upload-avatar" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewStudentForm(prev => ({ ...prev, avatar: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor="upload-avatar" 
                          className="flex-shrink-0 cursor-pointer bg-secondary border-theme hover:neu-button-accent hover:text-primary transition-colors text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2.5 rounded-xl flex items-center justify-center"
                        >
                          Upload
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-secondary block text-[10px] mb-1">Foto 1 Badan (URL / Upload) - Opsional</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/foto-full.jpg (atau upload)"
                          value={newStudentForm.fullBodyPhoto}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, fullBodyPhoto: e.target.value }))}
                          className="flex-1 min-w-0 text-xs p-2.5 rounded-xl border border-theme neu-pressed text-primary placeholder-slate-500 outline-none focus:border-blue-500/50"
                        />
                        <input 
                          type="file" 
                          id="upload-fullbody" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewStudentForm(prev => ({ ...prev, fullBodyPhoto: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor="upload-fullbody" 
                          className="flex-shrink-0 cursor-pointer bg-secondary border-theme hover:neu-button-accent hover:text-primary transition-colors text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2.5 rounded-xl flex items-center justify-center"
                        >
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Coach Selection */}
                  <div className="pt-1">
                    <label className="font-medium text-secondary block text-[10px] mb-1">Coach Penilai Awal</label>
                    <select
                      value={newStudentForm.evaluatedBy}
                      onChange={(e) => setNewStudentForm(prev => ({ ...prev, evaluatedBy: e.target.value }))}
                      className="w-full text-xs p-2 rounded-xl border border-theme neu-pressed text-primary font-medium cursor-pointer"
                    >
                      {coaches.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* notes */}
                  <div className="pt-1">
                    <textarea
                      rows={2}
                      placeholder="Tulis catatan pendukung awal..."
                      value={newStudentForm.notes}
                      onChange={(e) => setNewStudentForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-theme neu-pressed text-primary outline-none placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-orange-600 hover:from-orange-400 hover:to-blue-500 text-primary font-bold tracking-widest uppercase text-[11px] py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer text-center block mt-3"
                  >
                    {editingStudentId ? 'SIMPAN PERUBAHAN' : 'SIMPAN ATLET BARU'}
                  </button>
                </motion.form>
              </div>
            )}
          </AnimatePresence>,
          document.body
          )}
      
      {viewMode === 'list' && (
      <div className="flex flex-col gap-6" id="student-list-container">
        {/* LEFT: Student List Selection & Add Student Module (4 columns) */}
        {/* Student Roster Header Card */}
        <div className="neu-flat p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
              <Users className="w-5 h-5 text-purple-500" />
              Data Siswa Atlet
            </h3>
            
            <button
              id="btn-trigger-add-student"
              onClick={() => {
                setEditingStudentId(null);
                setNewStudentForm({
                  name: '',
                  age: 11,
                  height: 145,
                  weight: 38,
                  position: 'Point Guard',
                  classLevel: 'SD Berkembang',
                  parentName: '',
                  parentPhone: '',
                  parentEmail: '',
                  avatar: '',
                  fullBodyPhoto: '',
                  notes: '',
                  evaluatedBy: 'c_1'
                });
                setIsAddingStudent(true);
              }}
              className="text-[10px] font-bold uppercase tracking-widest neu-button-accent/10 text-blue-500 hover:text-blue-400 border border-blue-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          <p className="text-[11px] text-secondary font-medium mb-5 leading-relaxed">
            Kelola murid di akademi. Saring berdasarkan kelompok kelas tumbuh kembang anak.
          </p>

          {/* Class Filter Selection */}
          <div className="flex flex-wrap gap-2 mb-5 border-b border-theme pb-4" id="class-filter-tabs">
            <button
              onClick={() => setSelectedClassFilter('All')}
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedClassFilter === 'All'
                  ? 'bg-purple-900/40 text-primary border-purple-500/50'
                  : 'bg-primary text-secondary border-theme hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            {CLASS_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedClassFilter(level)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedClassFilter === level
                    ? 'neu-button-accent border-blue-400 shadow-md'
                    : 'bg-primary text-secondary border-theme hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>


          {/* Search Bar */}
          <div className="mt-4 mb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama atlet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs p-3 pl-10 rounded-xl border border-theme neu-pressed text-primary placeholder-slate-500 outline-none focus:border-blue-500/50 shadow-inner"
              />
              <svg className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Student Select Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 bg-primary rounded-xl border border-dashed border-theme text-secondary text-xs font-medium">
                Tidak ada murid di tingkat kelas ini.
              </div>
            ) : (
              filteredStudents.map((s) => {
                if (!s) return null;
                const isSelected = student && s.id === student.id;
                
                // Get skills safe calculation
                const sSkills = s.skills || { dribbling: 50, shooting: 50, passing: 50, defense: 50, physical: 50, teamwork: 50 };
                const sAvg = Math.round((Object.values(sSkills) as number[]).reduce((a, b) => a + b, 0) / 6);
                
                // Class Color code
                const classColors: Record<string, string> = {
                  'SD Lower': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                  'SD Berkembang': 'neu-button-accent/10 text-blue-400 border-blue-500/30',
                  'SD Upper': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                  'SMP': 'neu-button-accent/10 text-blue-400 border-blue-500/30',
                  'SMA': 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                };

                return (
                  <button
                    key={s.id}
                    id={`btn-select-student-${s.id}`}
                    onClick={() => {
                      onSelectStudent(s.id);
                      setViewMode('details');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'neu-button-accent/10 border-blue-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] scale-[1.02]'
                        : 'neu-pressed border-theme hover:border-slate-600 hover:neu-pressed/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full border bg-secondary flex items-center justify-center text-lg shrink-0 shadow-sm overflow-hidden ${
                        isSelected ? 'border-blue-500' : 'border-theme'
                      }`}>
                        {s.avatar?.startsWith('http') || s.avatar?.startsWith('data:') ? (
                          <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          s.avatar || '🏀'
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold text-xs truncate leading-tight ${isSelected ? 'text-blue-400' : 'text-primary'}`}>{s.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${classColors[s.classLevel] || 'bg-secondary text-secondary border-theme'}`}>
                            {s.classLevel}
                          </span>
                          <span className="text-[10px] text-secondary truncate font-medium uppercase tracking-widest">
                            {s.position}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[9px] font-bold text-secondary block leading-none uppercase tracking-widest mb-1">Rata</span>
                      <span className={`text-[12px] font-black px-2 py-0.5 rounded block ${
                        sAvg >= 80 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                        sAvg >= 70 ? 'text-blue-400 neu-button-accent/10 border border-blue-500/20' :
                        'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                      }`}>
                        {sAvg}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Academy Stats Card */}
        <div className="neu-flat p-6 shadow-lg relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none transform rotate-12">
            <Trophy className="w-40 h-40 text-blue-500 animate-pulse" />
          </div>
          <h4 className="text-[11px] font-bold text-purple-500 mb-3 uppercase tracking-widest">Ringkasan Skuad</h4>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-[10px] font-medium text-secondary block uppercase tracking-wider mb-1">Total Murid</span>
              <span className="text-2xl font-black text-primary">{students.length} <span className="text-sm font-medium text-secondary">Murid</span></span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-secondary block uppercase tracking-wider mb-1">Rata Skuad</span>
              <span className="text-2xl font-black text-blue-500">
                {students.length > 0
                  ? Math.round(students.reduce((acc, curr) => {
                      const skillsArr = Object.values(curr.skills || {}) as number[];
                      const avg = skillsArr.length > 0 ? skillsArr.reduce((a, b) => a + b, 0) / skillsArr.length : 0;
                      return acc + avg;
                    }, 0) / students.length)
                  : 0} <span className="text-sm font-medium text-secondary">/ 100</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* RIGHT: Detailed Skill Analysis & Charts (8 columns) */}
      {viewMode === 'details' && (
      <div className="flex flex-col gap-6" id="student-detail-container">
        
        {student ? (
          <>
            <button 
              onClick={() => setViewMode('list')}
              className="self-start text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-300 hover:text-primary px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 mb-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Kembali ke Daftar Atlet
            </button>
            {/* Header Profile Student (Vertical ID Card) */}
            <div className="max-w-[800px] mx-auto w-full md:aspect-[1086/1081]">
              <div className="bg-primary rounded-[calc(2rem-2px)] overflow-hidden relative flex flex-col md:flex-row h-full w-full">
                {/* Full body image container */}
                {/* Full body image container */}
                <div className="w-full md:w-[48%] relative bg-black shrink-0 overflow-hidden min-h-[400px] md:min-h-full flex items-end justify-center">
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-blue-500/20 mix-blend-screen" />
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />
                  <div className="absolute -right-20 top-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
                  
                  {student.fullBodyPhoto ? (
                    <img src={student.fullBodyPhoto} alt={student.name} className="w-full h-full object-cover object-top relative z-10" />
                  ) : (student.avatar?.startsWith('http') || student.avatar?.startsWith('data:')) ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover object-top relative z-10" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#2a2a35] relative z-10 pb-20">
                      <User className="w-32 h-32 mb-4" />
                      <span className="text-xs uppercase tracking-widest font-bold">Belum Ada Foto</span>
                    </div>
                  )}
                  
                  {/* Gradient fade to blend with right side on desktop and bottom on mobile */}
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#0B0A10] to-transparent hidden md:block z-20" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0A10] to-transparent md:hidden z-20" />
                </div>
                {/* Info container */}
                <div className="w-full md:w-[52%] p-6 md:p-8 lg:p-10 flex flex-col relative z-30 justify-between bg-transparent md:bg-transparent -mt-32 md:mt-0 h-full">
                  
                  <div className="flex flex-col items-start md:items-end w-full">
                    {/* Position Badge */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-primary font-black px-6 py-2 md:py-2.5 rounded-xl md:rounded-tr-[calc(2rem-2px)] md:rounded-bl-[1.5rem] md:rounded-tl-none md:rounded-br-none text-[10px] md:text-xs uppercase tracking-widest shadow-lg inline-block mb-4 md:mb-12 self-start md:self-end md:absolute md:top-0 md:right-0 z-40 relative">
                      {student.position}
                    </div>
                    {/* Name */}
                    <div className="w-full text-left mt-2 md:mt-16 drop-shadow-xl flex flex-col items-start">
                      {(() => {
                        const names = student.name.split(' ');
                        const first = names[0];
                        const rest = names.slice(1).join(' ');
                        return (
                          <>
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary italic uppercase tracking-tighter leading-[0.85] font-display">{first}</h2>
                            {rest && (
                              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-orange-400 font-display mt-1">
                                {rest}
                              </h2>
                            )}
                          </>
                        );
                      })()}
                      <div className="w-12 h-1.5 bg-gradient-to-r from-purple-500 to-transparent mt-5 md:mt-6 mb-6 md:mb-8 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    </div>
                  </div>
                  {/* Stats List */}
                  <div className="space-y-4 text-left flex-1 md:mt-2">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.25rem] border border-purple-500/40 flex items-center justify-center shrink-0 bg-transparent">
                        <Ruler className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest mb-0.5">Tinggi</span>
                        <span className="text-xl md:text-2xl font-medium text-primary leading-none">{student.height} <span className="text-sm md:text-base text-secondary font-normal">cm</span></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.25rem] border border-blue-500/40 flex items-center justify-center shrink-0 bg-transparent">
                        <Scale className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-blue-400 font-bold uppercase tracking-widest mb-0.5">Berat</span>
                        <span className="text-xl md:text-2xl font-medium text-primary leading-none">{student.weight} <span className="text-sm md:text-base text-secondary font-normal">kg</span></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.25rem] border border-rose-400/40 flex items-center justify-center shrink-0 bg-transparent">
                        <Calendar className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-rose-400 font-bold uppercase tracking-widest mb-0.5">Umur</span>
                        <span className="text-xl md:text-2xl font-medium text-primary leading-none">{student.age} <span className="text-sm md:text-base text-secondary font-normal">Tahun</span></span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-secondary border-theme my-5" />

                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.25rem] border border-purple-500/40 flex items-center justify-center shrink-0 bg-transparent">
                        <Users className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Orang Tua</span>
                        <span className="text-sm md:text-base font-medium text-primary leading-tight">{student.parentName || '-'}</span>
                        <span className="text-xs md:text-sm text-secondary mt-0.5">{student.parentPhone || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Bottom Bar */}
                  <div className="mt-8 space-y-5">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="relative group w-full">
                        <button
                          className="w-full py-3.5 md:py-4 rounded-3xl border border-purple-500/60 bg-purple-900/20 text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-purple-900/40 transition-colors shadow-lg"
                        >
                          <Download className="w-4 h-4" strokeWidth={2} />
                          IMPORT KARTU
                        </button>
                        
                        <div className="absolute bottom-full left-0 w-full mb-2 neu-pressed border border-theme rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <div className="max-h-48 overflow-y-auto">
                            {savedCards.length > 0 ? (
                              savedCards.map(card => (
                                <button
                                  key={card.id}
                                  onClick={() => onImportCard && onImportCard(student.id, card.id)}
                                  className="w-full text-left px-4 py-3 text-xs text-slate-300 hover:bg-secondary border-theme hover:text-primary transition-colors border-b border-theme last:border-0"
                                >
                                  {card.name} ({card.position})
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-xs text-secondary text-center">
                                Belum ada kartu tersimpan. Buat di Generator Siswa.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus murid bernama "${student.name}"?`)) {
                            onDeleteStudent(student.id);
                            setViewMode('list');
                          }
                        }}
                        className="w-full py-3.5 md:py-4 rounded-3xl border border-rose-500/60 bg-[#2a0a14] text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-950/80 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                        KELUARKAN MURID
                      </button>
                      
                      <button
                        onClick={() => {
                        setEditingStudentId(student.id);
                        setNewStudentForm({
                          name: student.name,
                          age: student.age,
                          height: student.height,
                          weight: student.weight,
                          position: student.position as any,
                          classLevel: student.classLevel as any,
                          parentName: student.parentName,
                          parentPhone: student.parentPhone,
                          parentEmail: student.parentEmail,
                          avatar: student.avatar || '',
                          fullBodyPhoto: student.fullBodyPhoto || '',
                          notes: student.notes || '',
                          evaluatedBy: student.evaluatedBy || 'c_1'
                        });
                        setIsAddingStudent(true);
                      }}
                        className="w-full py-2.5 rounded-2xl border border-transparent text-secondary font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 hover:neu-pressed hover:text-slate-300 transition-colors"
                        id="btn-edit-student-ghost"
                      >
                        <Edit3 className="w-3.5 h-3.5" strokeWidth={2} />
                        EDIT DATA MURID
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Kehadiran</span>
                        <span className="text-3xl md:text-4xl font-black text-primary leading-none">{attendanceRate}%</span>
                      </div>
                      
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] border-2 flex flex-col items-center justify-center shrink-0 bg-transparent ${letterGrade.grade === 'A' ? 'text-emerald-500 border-emerald-500' : letterGrade.grade === 'B' ? 'text-blue-500 border-blue-500' : letterGrade.grade === 'C' ? 'text-yellow-500 border-yellow-500' : 'text-rose-500 border-rose-500'}`}>
                        <span className="text-3xl md:text-4xl font-black leading-none">{letterGrade.grade}</span>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1 opacity-90">{letterGrade.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Dynamic Skill Analyzer & Interactive Radars */}
            {/* Dynamic Skill Analyzer & Interactive Radars */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Radar Chart Visualizer (5 columns) */}
              <div className="md:col-span-5 neu-flat p-5 shadow-lg flex flex-col items-center justify-center min-h-[340px]">
                <h4 className="text-sm font-bold text-primary mb-1 flex items-center gap-2 self-start px-2 tracking-wide">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Radar Skill Matrix
                </h4>
                <p className="text-[10px] text-secondary mb-2 self-start px-2 font-medium">
                  Visualisasi kekuatan fisik dan teknik basket murid.
                </p>

                <div className="w-full relative flex items-center justify-center pt-2">
                  <svg viewBox="0 0 300 300" className="w-full max-w-[250px] h-auto overflow-visible">
                    <defs>
                      <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.05" />
                      </radialGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Concentric Web Grid Rings (20, 40, 60, 80, 100) */}
                    {[20, 40, 60, 80, 100].map((ring, rIdx) => {
                      const radius = ring;
                      const pointsStr = skillsKeys.map((_, sIdx) => {
                        const angle = (sIdx * 2 * Math.PI) / 6 - Math.PI / 2;
                        const x = 150 + radius * Math.cos(angle);
                        const y = 150 + radius * Math.sin(angle);
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <polygon
                          key={rIdx}
                          points={pointsStr}
                          fill="none"
                          stroke={ring === 100 ? "#2a2a35" : "#1c1c28"}
                          strokeWidth={ring === 100 ? "2" : "1"}
                          strokeDasharray={ring === 100 ? "none" : "3,3"}
                        />
                      );
                    })}

                    {/* Axial web lines from center to outer ring */}
                    {radarPoints.map((p, i) => (
                      <line
                        key={i}
                        x1="150"
                        y1="150"
                        x2={p.webX}
                        y2={p.webY}
                        stroke="#1c1c28"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Concentric Helper labels */}
                    <text x="150" y="112" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">40</text>
                    <text x="150" y="72" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">80</text>

                    {/* The Filled Area (Skill Polygon) */}
                    <polygon
                      points={polygonPath}
                      fill="url(#radarGlow)"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                      filter="url(#glow)"
                    />

                    {/* Dots on Vertices */}
                    {radarPoints.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#f97316"
                        stroke="#13131a"
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-150 hover:fill-purple-500 transition-transform"
                        onMouseEnter={() => setShowTooltip({ x: p.x, y: p.y - 12, label: p.label, value: p.score })}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                    ))}

                    {/* Category Labels */}
                    {radarPoints.map((p, i) => {
                      const angle = p.angle;
                      const offsetR = 118; // offset from center
                      const x = 150 + offsetR * Math.cos(angle);
                      const y = 150 + offsetR * Math.sin(angle);

                      let textAnchor = 'middle';
                      if (Math.cos(angle) > 0.1) textAnchor = 'start';
                      else if (Math.cos(angle) < -0.1) textAnchor = 'end';

                      let dy = '0.35em';
                      if (Math.sin(angle) < -0.9) dy = '-0.2em';
                      else if (Math.sin(angle) > 0.9) dy = '0.9em';

                      return (
                        <text
                          key={i}
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          dy={dy}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="600"
                        >
                          {p.label} ({p.score})
                        </text>
                      );
                    })}

                    {/* Render Interactive Tooltip Inside SVG */}
                    {showTooltip && (
                      <g className="pointer-events-none">
                        <rect
                          x={showTooltip.x - 45}
                          y={showTooltip.y - 25}
                          width="90"
                          height="20"
                          rx="4"
                          fill="#2a2a35"
                          opacity="0.95"
                          stroke="#f97316"
                          strokeWidth="1"
                        />
                        <text
                          x={showTooltip.x}
                          y={showTooltip.y - 12}
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {showTooltip.label}: {showTooltip.value}
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
                
                <div className="w-full mt-4 neu-pressed rounded-xl p-3 border border-theme text-center">
                  <span className="text-[10px] text-secondary block font-medium uppercase tracking-widest mb-1">Rata-rata Penilaian</span>
                  <span className="text-xl font-black text-blue-500">{averageScore} <span className="text-xs font-medium text-secondary">/ 100</span></span>
                </div>
              </div>

              {/* Skill Ratings & Sliders (7 columns) */}
              <div className="md:col-span-7 neu-flat p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-500" />
                      Penilaian Skill & Evaluator
                    </h4>
                    
                    {!isEditing ? (
                      <button
                        id="btn-edit-skills"
                        onClick={() => setIsEditing(true)}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-300 neu-pressed hover:bg-secondary border-theme border border-theme px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Ubah Evaluasi
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          id="btn-cancel-edit-skills"
                          onClick={() => {
                            setEditedSkills({ ...student.skills });
                            setEditedNotes(student.notes);
                            setEditedEvaluator(student.evaluatedBy || 'c_1');
                            setIsEditing(false);
                          }}
                          className="text-[10px] font-medium text-secondary hover:text-primary px-3 py-1 cursor-pointer transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          id="btn-save-skills"
                          onClick={handleSave}
                          className="text-[10px] font-bold uppercase tracking-widest neu-button-accent border border-blue-400 px-4 py-2 rounded-xl shadow-md hover:scale-105 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Simpan
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Evaluator Coach Indicator Display */}
                  <div className="mb-5 neu-pressed border border-theme rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-blue-500/50 bg-secondary flex items-center justify-center text-lg shadow-md overflow-hidden">
                        {activeEvaluator.avatar?.startsWith('http') || activeEvaluator.avatar?.startsWith('data:') ? (
                          <img src={activeEvaluator.avatar} alt={activeEvaluator.name} className="w-full h-full object-cover" />
                        ) : (
                          activeEvaluator.avatar || '👤'
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] text-secondary block font-bold uppercase tracking-widest leading-none mb-1">COACH PENILAI</span>
                        <span className="text-xs font-black text-primary">{activeEvaluator.name}</span>
                        <span className="text-[9px] text-secondary block font-bold uppercase tracking-widest mt-0.5">{activeEvaluator.role}</span>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="shrink-0">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">Ganti Coach Penilai:</label>
                        <select
                          value={editedEvaluator}
                          onChange={(e) => setEditedEvaluator(e.target.value)}
                          className="text-[10px] font-medium border border-theme bg-secondary text-slate-200 rounded-lg p-1.5 outline-none cursor-pointer focus:border-slate-500"
                        >
                          {coaches.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="text-right hidden sm:block">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 neu-button-accent/10 border border-blue-500/30 px-3 py-1 rounded-full">
                          Spesialis: {activeEvaluator.specialty.split(' (')[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slider list */}
                  <div className="space-y-4">
                    {skillsKeys.map((item) => {
                      const value = currentSkills[item.key] || 50;
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <Icon className="w-3.5 h-3.5 text-secondary" />
                              {item.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                              value >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                              value >= 70 ? 'neu-button-accent/20 text-blue-400' :
                              'bg-rose-500/20 text-rose-400'
                            }`}>{value} <span className="text-[9px] font-medium text-secondary">/ 100</span></span>
                          </div>
                          
                          {isEditing ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={value}
                                onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-2 neu-pressed rounded-lg cursor-pointer border border-theme"
                              />
                            </div>
                          ) : (
                            <div className="w-full neu-pressed h-2 rounded-full overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  item.key === 'dribbling' ? 'neu-button-accent' :
                                  item.key === 'shooting' ? 'bg-red-500' :
                                  item.key === 'passing' ? 'bg-yellow-500' :
                                  item.key === 'defense' ? 'neu-button-accent' :
                                  item.key === 'physical' ? 'bg-purple-500' :
                                  'bg-emerald-500'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Coach comments box */}
                <div className="mt-5 pt-4 border-t border-theme">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-2">Catatan Evaluasi Detail:</span>
                  {isEditing ? (
                    <textarea
                      id="textarea-coach-notes"
                      rows={3}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Ketik evaluasi dan catatan perkembangan murid di sini..."
                      className="w-full text-xs p-3 rounded-xl border border-theme neu-pressed outline-none focus:border-slate-500 text-slate-300 font-medium leading-relaxed resize-none"
                    />
                  ) : (
                    <div className="neu-pressed border border-theme rounded-xl p-4 text-xs text-secondary leading-relaxed font-medium italic relative">
                      <span className="absolute top-2 right-3 text-[8px] uppercase tracking-widest font-bold text-slate-600">Oleh {activeEvaluator.name}</span>
                      "{student.notes || 'Belum ada catatan evaluasi dari pelatih.'}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="neu-flat p-12 shadow-lg text-center text-secondary text-sm font-medium">
            Pilih atau tambahkan siswa baru untuk melihat rincian evaluasi.
          </div>
        )}

      </div>
      )}
    </div>
  );
}
