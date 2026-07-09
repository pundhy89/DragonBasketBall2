/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Student, StudentSkills, Coach } from '../types';
import {
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
  Calendar
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
}

const CLASS_LEVELS = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'] as const;
const BASKETBALL_POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'] as const;
const EMOJI_AVATARS = ['🏀', '⚡', '🔥', '🛡️', '👟', '🌟', '👶', '🧒', '👧', '🦁', '🦊', '🦅', '🦈'];

export default function StudentStats({
  students,
  selectedStudentId,
  onSelectStudent,
  onUpdateSkills,
  coaches,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
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
    { key: 'shooting', label: 'Shooting', icon: Trophy, color: 'text-orange-500' },
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
    if (averageScore >= 85) return { grade: 'A', text: 'Sangat Baik', color: 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_0_#059669]' };
    if (averageScore >= 75) return { grade: 'B', text: 'Baik', color: 'bg-amber-500 text-slate-950 border-amber-600 shadow-[0_4px_0_0_#d97706]' };
    if (averageScore >= 60) return { grade: 'C', text: 'Cukup', color: 'bg-yellow-400 text-slate-950 border-yellow-500 shadow-[0_4px_0_0_#ca8a04]' };
    return { grade: 'D', text: 'Butuh Latihan', color: 'bg-red-500 text-white border-red-600 shadow-[0_4px_0_0_#dc2626]' };
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
                  className="relative bg-[#0B0A10] border border-orange-500/30 rounded-2xl p-5 md:p-6 w-full max-w-lg shadow-2xl space-y-4 text-xs text-slate-300 max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
                >
                  <div className="flex justify-between items-center border-b border-[#2a2a35] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      {editingStudentId ? <Edit3 className="w-4 h-4 text-orange-500" /> : <UserPlus className="w-4 h-4 text-orange-500" />}
                      <span className="font-bold text-white uppercase text-[11px] tracking-widest">
                        {editingStudentId ? 'EDIT DATA SISWA' : 'FORMULIR SISWA BARU'}
                      </span>
                    </div>
                    <button type="button" onClick={() => setIsAddingStudent(false)} className="text-slate-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-400 block text-[11px]">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rian Perkasa"
                      value={newStudentForm.name}
                      onChange={(e) => setNewStudentForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500/50"
                    />
                  </div>

                  {/* Grid for parameters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Umur (Thn)</label>
                      <input
                        type="number"
                        min="6"
                        max="19"
                        value={newStudentForm.age}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                        className="w-full text-xs p-2 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Tinggi (cm)</label>
                      <input
                        type="number"
                        min="100"
                        max="220"
                        value={newStudentForm.height}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, height: Number(e.target.value) }))}
                        className="w-full text-xs p-2 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Berat (kg)</label>
                      <input
                        type="number"
                        min="20"
                        max="120"
                        value={newStudentForm.weight}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                        className="w-full text-xs p-2 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white"
                      />
                    </div>
                  </div>

                  {/* Grid for class division & position */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Tingkat Kelas</label>
                      <select
                        value={newStudentForm.classLevel}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, classLevel: e.target.value as any }))}
                        className="w-full text-[11px] p-2 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white font-bold cursor-pointer"
                      >
                        {CLASS_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Posisi Bermain</label>
                      <select
                        value={newStudentForm.position}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, position: e.target.value as any }))}
                        className="w-full text-[11px] p-2 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white font-medium cursor-pointer"
                      >
                        {BASKETBALL_POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Parent Contact */}
                  <div className="space-y-2 border-t border-[#2a2a35] pt-3 mt-3">
                    <span className="font-bold text-orange-500 block text-[10px] uppercase tracking-widest">Kontak Wali / Orang Tua</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Nama Orang Tua"
                          value={newStudentForm.parentName}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, parentName: e.target.value }))}
                          className="w-full text-xs p-2.5 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="No. WhatsApp"
                          value={newStudentForm.parentPhone}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                          className="w-full text-xs p-2.5 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo URLs / File Uploads */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Foto Wajah (URL / Upload) *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/foto-wajah.jpg (atau upload)"
                          value={newStudentForm.avatar}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, avatar: e.target.value }))}
                          className="flex-1 min-w-0 text-xs p-2.5 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white placeholder-slate-500 outline-none focus:border-orange-500/50"
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
                          className="flex-shrink-0 cursor-pointer bg-[#2a2a35] hover:bg-orange-500 hover:text-white transition-colors text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2.5 rounded-xl flex items-center justify-center"
                        >
                          Upload
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-slate-400 block text-[10px] mb-1">Foto 1 Badan (URL / Upload) - Opsional</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/foto-full.jpg (atau upload)"
                          value={newStudentForm.fullBodyPhoto}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, fullBodyPhoto: e.target.value }))}
                          className="flex-1 min-w-0 text-xs p-2.5 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white placeholder-slate-500 outline-none focus:border-orange-500/50"
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
                          className="flex-shrink-0 cursor-pointer bg-[#2a2a35] hover:bg-orange-500 hover:text-white transition-colors text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 py-2.5 rounded-xl flex items-center justify-center"
                        >
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Coach Selection */}
                  <div className="pt-1">
                    <label className="font-medium text-slate-400 block text-[10px] mb-1">Coach Penilai Awal</label>
                    <select
                      value={newStudentForm.evaluatedBy}
                      onChange={(e) => setNewStudentForm(prev => ({ ...prev, evaluatedBy: e.target.value }))}
                      className="w-full text-xs p-2 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white font-medium cursor-pointer"
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
                      className="w-full text-xs p-2.5 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold tracking-widest uppercase text-[11px] py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer text-center block mt-3"
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
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
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
              className="text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-500 hover:text-orange-400 border border-orange-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium mb-5 leading-relaxed">
            Kelola murid di akademi. Saring berdasarkan kelompok kelas tumbuh kembang anak.
          </p>

          {/* Class Filter Selection */}
          <div className="flex flex-wrap gap-2 mb-5 border-b border-[#2a2a35] pb-4" id="class-filter-tabs">
            <button
              onClick={() => setSelectedClassFilter('All')}
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedClassFilter === 'All'
                  ? 'bg-purple-900/40 text-white border-purple-500/50'
                  : 'bg-[#0B0A10] text-slate-400 border-[#2a2a35] hover:text-slate-200'
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
                    ? 'bg-orange-500 text-white border-orange-400 shadow-md'
                    : 'bg-[#0B0A10] text-slate-400 border-[#2a2a35] hover:text-slate-200'
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
                className="w-full text-xs p-3 pl-10 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white placeholder-slate-500 outline-none focus:border-orange-500/50 shadow-inner"
              />
              <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Student Select Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 bg-[#0B0A10] rounded-xl border border-dashed border-[#2a2a35] text-slate-400 text-xs font-medium">
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
                  'SD Berkembang': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
                  'SD Upper': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                  'SMP': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
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
                        ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] scale-[1.02]'
                        : 'bg-[#1c1c28] border-[#2a2a35] hover:border-slate-600 hover:bg-[#1c1c28]/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full border bg-[#13131a] flex items-center justify-center text-lg shrink-0 shadow-sm overflow-hidden ${
                        isSelected ? 'border-orange-500' : 'border-[#2a2a35]'
                      }`}>
                        {s.avatar?.startsWith('http') || s.avatar?.startsWith('data:') ? (
                          <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          s.avatar || '🏀'
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold text-xs truncate leading-tight ${isSelected ? 'text-orange-400' : 'text-white'}`}>{s.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${classColors[s.classLevel] || 'bg-[#13131a] text-slate-500 border-[#2a2a35]'}`}>
                            {s.classLevel}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-widest">
                            {s.position}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[9px] font-bold text-slate-500 block leading-none uppercase tracking-widest mb-1">Rata</span>
                      <span className={`text-[12px] font-black px-2 py-0.5 rounded block ${
                        sAvg >= 80 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                        sAvg >= 70 ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' :
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
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none transform rotate-12">
            <Trophy className="w-40 h-40 text-orange-500 animate-pulse" />
          </div>
          <h4 className="text-[11px] font-bold text-purple-500 mb-3 uppercase tracking-widest">Ringkasan Skuad</h4>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider mb-1">Total Murid</span>
              <span className="text-2xl font-black text-white">{students.length} <span className="text-sm font-medium text-slate-500">Murid</span></span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider mb-1">Rata Skuad</span>
              <span className="text-2xl font-black text-orange-500">
                {students.length > 0
                  ? Math.round(students.reduce((acc, curr) => {
                      const skillsArr = Object.values(curr.skills || {}) as number[];
                      const avg = skillsArr.length > 0 ? skillsArr.reduce((a, b) => a + b, 0) / skillsArr.length : 0;
                      return acc + avg;
                    }, 0) / students.length)
                  : 0} <span className="text-sm font-medium text-slate-500">/ 100</span>
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
              className="self-start text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 mb-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Kembali ke Daftar Atlet
            </button>
            {/* Header Profile Student (Vertical ID Card) */}
            <div className="bg-[#13131a] border border-[#2a2a35] rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
              {/* Full body image container */}
              <div className="w-full md:w-1/2 lg:w-[45%] relative bg-black shrink-0 overflow-hidden min-h-[400px] md:min-h-[600px] flex items-end justify-center">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-orange-500/20 mix-blend-screen" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -right-20 top-20 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full pointer-events-none" />
                
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
                <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#13131a] to-transparent hidden md:block z-20" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#13131a] to-transparent md:hidden z-20" />
              </div>

              {/* Info container */}
              <div className="w-full md:w-1/2 lg:w-[55%] p-6 md:p-10 flex flex-col relative z-30 justify-between bg-transparent md:bg-[#13131a] -mt-32 md:mt-0">
                
                <div className="flex flex-col items-start md:items-end w-full">
                  {/* Position Badge */}
                  <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white font-black px-6 py-2 md:py-2.5 rounded-xl md:rounded-bl-xl md:rounded-tr-none text-[10px] md:text-xs uppercase tracking-widest shadow-lg inline-block mb-4 md:mb-12 self-start md:self-end md:absolute md:top-0 md:right-0 z-40 relative">
                    {student.position}
                  </div>

                  {/* Name */}
                  <div className="w-full text-left md:text-right mt-2 md:mt-0 drop-shadow-xl">
                    {(() => {
                      const names = student.name.split(' ');
                      const first = names[0];
                      const rest = names.slice(1).join(' ');
                      return (
                        <>
                          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] font-display">{first}</h2>
                          {rest && (
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-orange-400 font-display mt-1">
                              {rest}
                            </h2>
                          )}
                        </>
                      );
                    })()}
                    <div className="w-16 h-1.5 bg-orange-500 mt-6 md:ml-auto mb-8 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                  </div>
                </div>

                {/* Stats List */}
                <div className="space-y-5 text-left flex-1 md:mt-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-purple-500/30 flex items-center justify-center shrink-0 bg-[#0B0A10]/80 backdrop-blur-sm">
                      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest block mb-0.5">Tinggi</span>
                      <span className="text-xl md:text-2xl font-medium text-white">{student.height} <span className="text-xs md:text-sm text-slate-400">cm</span></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-orange-500/30 flex items-center justify-center shrink-0 bg-[#0B0A10]/80 backdrop-blur-sm">
                      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] md:text-xs text-orange-400 font-bold uppercase tracking-widest block mb-0.5">Berat</span>
                      <span className="text-xl md:text-2xl font-medium text-white">{student.weight} <span className="text-xs md:text-sm text-slate-400">kg</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-rose-500/30 flex items-center justify-center shrink-0 bg-[#0B0A10]/80 backdrop-blur-sm">
                      <Calendar className="w-6 h-6 md:w-7 md:h-7 text-rose-400" />
                    </div>
                    <div>
                      <span className="text-[10px] md:text-xs text-rose-400 font-bold uppercase tracking-widest block mb-0.5">Umur</span>
                      <span className="text-xl md:text-2xl font-medium text-white">{student.age} <span className="text-xs md:text-sm text-slate-400">Tahun</span></span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2a2a35] to-transparent my-6" />

                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-blue-500/30 flex items-center justify-center shrink-0 bg-[#0B0A10]/80 backdrop-blur-sm">
                      <Users className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-[10px] md:text-xs text-blue-400 font-bold uppercase tracking-widest block mb-1">Orang Tua</span>
                      <span className="text-sm md:text-base font-medium text-white block">{student.parentName || '-'}</span>
                      <span className="text-xs md:text-sm text-slate-400 block">{student.parentPhone || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Bottom Bar */}
                <div className="mt-10 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
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
                      className="flex-1 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-white bg-[#1c1c28]/80 backdrop-blur-sm border border-[#2a2a35] hover:border-slate-500 py-3 md:py-3.5 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Data
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Apakah Anda yakin ingin menghapus murid bernama "${student.name}" dari seluruh database Basketball Academy? Tindakan ini tidak dapat dibatalkan.`)) {
                          onDeleteStudent(student.id);
                          setViewMode('list');
                        }
                      }}
                      className="flex-1 text-[11px] font-bold uppercase tracking-widest text-rose-500 hover:text-white bg-[#1c1c28]/80 backdrop-blur-sm border border-rose-500/30 hover:bg-rose-500 hover:border-rose-500 py-3 md:py-3.5 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Keluarkan Murid
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-[#1c1c28]/40 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-[#2a2a35]">
                    <div>
                      <span className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest block mb-1">Kehadiran</span>
                      <span className="text-3xl md:text-4xl font-black text-white">{attendanceRate}%</span>
                    </div>
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-lg ${letterGrade.grade === 'A' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' : letterGrade.grade === 'B' ? 'bg-orange-500/20 text-orange-500 border-orange-500/40' : letterGrade.grade === 'C' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' : 'bg-rose-500/20 text-rose-500 border-rose-500/40'}`}>
                      <span className="text-3xl md:text-4xl font-black leading-none">{letterGrade.grade}</span>
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1 md:mt-2 opacity-80">{letterGrade.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Skill Analyzer & Interactive Radars */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Radar Chart Visualizer (5 columns) */}
              <div className="md:col-span-5 bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg flex flex-col items-center justify-center min-h-[340px]">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2 self-start px-2 tracking-wide">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Radar Skill Matrix
                </h4>
                <p className="text-[10px] text-slate-400 mb-2 self-start px-2 font-medium">
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
                
                <div className="w-full mt-4 bg-[#1c1c28] rounded-xl p-3 border border-[#2a2a35] text-center">
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-widest mb-1">Rata-rata Penilaian</span>
                  <span className="text-xl font-black text-orange-500">{averageScore} <span className="text-xs font-medium text-slate-500">/ 100</span></span>
                </div>
              </div>

              {/* Skill Ratings & Sliders (7 columns) */}
              <div className="md:col-span-7 bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-500" />
                      Penilaian Skill & Evaluator
                    </h4>
                    
                    {!isEditing ? (
                      <button
                        id="btn-edit-skills"
                        onClick={() => setIsEditing(true)}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-[#1c1c28] hover:bg-[#2a2a35] border border-[#2a2a35] px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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
                          className="text-[10px] font-medium text-slate-400 hover:text-white px-3 py-1 cursor-pointer transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          id="btn-save-skills"
                          onClick={handleSave}
                          className="text-[10px] font-bold uppercase tracking-widest bg-orange-500 text-white border border-orange-400 px-4 py-2 rounded-xl shadow-md hover:scale-105 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Simpan
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Evaluator Coach Indicator Display */}
                  <div className="mb-5 bg-[#1c1c28] border border-[#2a2a35] rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-orange-500/50 bg-[#13131a] flex items-center justify-center text-lg shadow-md overflow-hidden">
                        {activeEvaluator.avatar?.startsWith('http') || activeEvaluator.avatar?.startsWith('data:') ? (
                          <img src={activeEvaluator.avatar} alt={activeEvaluator.name} className="w-full h-full object-cover" />
                        ) : (
                          activeEvaluator.avatar || '👤'
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-widest leading-none mb-1">COACH PENILAI</span>
                        <span className="text-xs font-black text-white">{activeEvaluator.name}</span>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest mt-0.5">{activeEvaluator.role}</span>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="shrink-0">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Ganti Coach Penilai:</label>
                        <select
                          value={editedEvaluator}
                          onChange={(e) => setEditedEvaluator(e.target.value)}
                          className="text-[10px] font-medium border border-[#2a2a35] bg-[#13131a] text-slate-200 rounded-lg p-1.5 outline-none cursor-pointer focus:border-slate-500"
                        >
                          {coaches.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="text-right hidden sm:block">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
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
                              <Icon className="w-3.5 h-3.5 text-slate-500" />
                              {item.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                              value >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                              value >= 70 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-rose-500/20 text-rose-400'
                            }`}>{value} <span className="text-[9px] font-medium text-slate-500">/ 100</span></span>
                          </div>
                          
                          {isEditing ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={value}
                                onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-2 bg-[#1c1c28] rounded-lg cursor-pointer border border-[#2a2a35]"
                              />
                            </div>
                          ) : (
                            <div className="w-full bg-[#1c1c28] h-2 rounded-full overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  item.key === 'dribbling' ? 'bg-orange-500' :
                                  item.key === 'shooting' ? 'bg-red-500' :
                                  item.key === 'passing' ? 'bg-yellow-500' :
                                  item.key === 'defense' ? 'bg-blue-500' :
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
                <div className="mt-5 pt-4 border-t border-[#2a2a35]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Catatan Evaluasi Detail:</span>
                  {isEditing ? (
                    <textarea
                      id="textarea-coach-notes"
                      rows={3}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Ketik evaluasi dan catatan perkembangan murid di sini..."
                      className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] outline-none focus:border-slate-500 text-slate-300 font-medium leading-relaxed resize-none"
                    />
                  ) : (
                    <div className="bg-[#1c1c28] border border-[#2a2a35] rounded-xl p-4 text-xs text-slate-400 leading-relaxed font-medium italic relative">
                      <span className="absolute top-2 right-3 text-[8px] uppercase tracking-widest font-bold text-slate-600">Oleh {activeEvaluator.name}</span>
                      "{student.notes || 'Belum ada catatan evaluasi dari pelatih.'}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-12 shadow-lg text-center text-slate-500 text-sm font-medium">
            Pilih atau tambahkan siswa baru untuk melihat rincian evaluasi.
          </div>
        )}

      </div>
      )}
    </div>
  );
}
