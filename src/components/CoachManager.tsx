import React, { useState } from 'react';
import { Coach } from '../types';
import { Shield, User, Edit3, Trash2, Plus, X, Check, Award, QrCode, Barcode, ClipboardList, UserCircle2, Dribbble } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoachManagerProps {
  coaches: Coach[];
  onAddCoach: (coach: Omit<Coach, 'id'>) => void;
  onUpdateCoach: (id: string, coach: Partial<Coach>) => void;
  onDeleteCoach: (id: string) => void;
}

export default function CoachManager({ coaches, onAddCoach, onUpdateCoach, onDeleteCoach }: CoachManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Pelatih Kepala',
    specialty: 'Taktik Tim & Penyerangan (Offense)',
    avatar: '👨‍🏫',
    experience: '10+ Tahun Melatih',
    certification: 'Lisensi Kepelatihan Nasional'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Pelatih Kepala',
      specialty: 'Taktik Tim & Penyerangan (Offense)',
      avatar: '👨‍🏫',
      experience: '10+ Tahun Melatih',
      certification: 'Lisensi Kepelatihan Nasional'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name) return;
    if (editingId) {
      onUpdateCoach(editingId, formData);
    } else {
      onAddCoach(formData);
    }
    resetForm();
  };

  const startEdit = (coach: Coach) => {
    setFormData({
      name: coach.name,
      role: coach.role,
      specialty: coach.specialty,
      avatar: coach.avatar,
      experience: coach.experience || '10+ Tahun Melatih',
      certification: coach.certification || 'Lisensi Kepelatihan Nasional'
    });
    setEditingId(coach.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
          <Shield className="text-orange-500 w-6 h-6" />
          Manajemen Pelatih
        </h2>
        <button
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Pelatih
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1c1c28] border border-[#2a2a35] p-5 rounded-2xl shadow-lg space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-300">{editingId ? 'Edit Pelatih' : 'Tambah Pelatih Baru'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Nama Pelatih</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#13131a] border border-[#2a2a35] text-white rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Misal: Coach Budi"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Peran</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#13131a] border border-[#2a2a35] text-white rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Misal: Asisten Pelatih"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Spesialisasi</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-[#13131a] border border-[#2a2a35] text-white rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Misal: Defense & Fisik"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Pengalaman</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-[#13131a] border border-[#2a2a35] text-white rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Misal: 10+ Tahun Melatih"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Sertifikasi</label>
                <input
                  type="text"
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full bg-[#13131a] border border-[#2a2a35] text-white rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Misal: Lisensi Nasional"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">URL Foto (Upload Opsional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="flex-1 min-w-0 bg-[#13131a] border border-[#2a2a35] text-white rounded-lg p-3 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="URL gambar atau emoji 👨‍🏫"
                  />
                  <input 
                    type="file" 
                    id="upload-coach-avatar" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, avatar: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label 
                    htmlFor="upload-coach-avatar" 
                    className="flex-shrink-0 cursor-pointer bg-[#2a2a35] hover:bg-orange-500 hover:text-white transition-colors text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-3 rounded-lg flex items-center justify-center"
                  >
                    Upload
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-[#13131a] hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {coaches.map((coach) => (
          <div key={coach.id} className="relative group bg-[#0a0a0a] border border-[#2a2a35] rounded-3xl p-4 sm:p-6 shadow-2xl flex gap-4 sm:gap-6 overflow-hidden min-h-[240px] sm:min-h-[300px]">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 pointer-events-none"></div>
            
            {/* Top Right ID Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-purple-700 to-orange-500 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-lg z-10 shadow-lg">
              COACH ID CARD
            </div>

            {/* Left Photo Area */}
            <div className="w-2/5 sm:w-1/3 flex flex-col justify-end relative z-10 rounded-2xl overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
              {coach.avatar.startsWith('http') ? (
                <img src={coach.avatar} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#13131a] text-5xl sm:text-6xl shadow-inner border border-[#2a2a35] rounded-2xl">
                  {coach.avatar}
                </div>
              )}
              
              <div className="relative z-20 mt-auto pb-3 sm:pb-4 px-2 w-full text-center">
                <Barcode className="text-white/50 w-full h-6 sm:h-10 mx-auto" />
                <div className="text-[6px] sm:text-[8px] text-slate-400 mt-1 tracking-[0.2em]">{coach.id.toUpperCase()}</div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="w-3/5 sm:w-2/3 flex flex-col justify-center relative z-10 pt-5 sm:pt-6">
              <h3 className="font-black italic text-xl sm:text-3xl text-white uppercase leading-tight mb-1.5 sm:mb-2 tracking-tight">
                {coach.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-3 sm:mb-6">
                <div className="border border-orange-500/30 text-orange-500 bg-orange-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs font-bold uppercase tracking-widest">
                  <UserCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  {coach.role}
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-4 bg-[#13131a]/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-[#2a2a35]/50 flex-1 flex flex-col justify-center">
                {/* Specialty */}
                <div className="flex gap-2 sm:gap-3">
                   <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 bg-purple-500/10">
                     <ClipboardList className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                   </div>
                   <div className="min-w-0 flex-1">
                     <div className="text-[8px] sm:text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-0.5 truncate">Spesialisasi</div>
                     <div className="text-xs sm:text-sm text-slate-200 leading-tight">{coach.specialty}</div>
                   </div>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="flex items-end justify-between mt-3 sm:mt-6">
                <div>
                  <div className="text-orange-500 font-bold italic tracking-wider text-[10px] sm:text-sm mb-0.5">ONE TEAM ONE DREAM</div>
                  <div className="text-[7px] sm:text-[9px] text-slate-500 font-medium tracking-[0.2em] uppercase">We Build Champions</div>
                </div>
                <QrCode className="w-8 h-8 sm:w-14 sm:h-14 text-white/80" />
              </div>
            </div>

            {/* Actions (Always Visible for touch-friendly UX) */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2 z-20">
              <button
                onClick={() => startEdit(coach)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-lg"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteCoach(coach.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-lg"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
