/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PracticeSession } from '../types';
import { Calendar, Clock, MapPin, User, Plus, CheckCircle, Flame, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScheduleManagerProps {
  schedule: PracticeSession[];
  onAddPractice: (session: Omit<PracticeSession, 'id' | 'completed'>) => void;
  onToggleCompletePractice: (id: string) => void;
}

export default function ScheduleManager({
  schedule,
  onAddPractice,
  onToggleCompletePractice
}: ScheduleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-06-27');
  const [time, setTime] = useState('16:00');
  const [location, setLocation] = useState('Astra Arena, Court A');
  const [focus, setFocus] = useState<PracticeSession['focus']>('Dribbling');
  const [coach, setCoach] = useState('Coach Andi');
  const [description, setDescription] = useState('');

  const [formSuccess, setFormSuccess] = useState(false);

  // Sorting sessions by date
  const sortedSchedule = useMemo(() => {
    return [...schedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    onAddPractice({
      title,
      date,
      time,
      location,
      focus,
      coach,
      description
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsAdding(false);
      // Reset form fields
      setTitle('');
      setDescription('');
    }, 1500);
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (practiceDateStr: string) => {
    const today = new Date('2026-06-26'); // simulated today
    const practiceDate = new Date(practiceDateStr);
    const diffTime = practiceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari Ini';
    if (diffDays === 1) return 'Besok';
    if (diffDays < 0) return 'Selesai';
    return `${diffDays} Hari Lagi`;
  };

  const focusColors: { [key in PracticeSession['focus']]: string } = {
    'Dribbling': 'bg-amber-100 text-amber-800 border-amber-300 shadow-[1px_1px_0px_0px_#d97706]',
    'Shooting': 'bg-orange-100 text-orange-800 border-orange-300 shadow-[1px_1px_0px_0px_#ea580c]',
    'Passing': 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-[1px_1px_0px_0px_#ca8a04]',
    'Defense': 'bg-blue-100 text-blue-800 border-blue-300 shadow-[1px_1px_0px_0px_#2563eb]',
    'Stamina & Tactics': 'bg-red-100 text-red-800 border-red-300 shadow-[1px_1px_0px_0px_#dc2626]',
    'Scrimmage': 'bg-purple-100 text-purple-800 border-purple-300 shadow-[1px_1px_0px_0px_#9333ea]'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="schedule-workspace">
      
      {/* LEFT: Add Schedule Form / Action Panel (4 columns) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calendar className="w-32 h-32 text-orange-500 transform rotate-12" />
          </div>
          
          <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2 tracking-wide">
            <Calendar className="w-5 h-5 text-orange-500" />
            Manajemen Jadwal
          </h4>
          <p className="text-[11px] text-slate-400 mb-5 leading-relaxed font-medium">
            Atur kalender latihan rutin, tetapkan instruktur coach, tentukan fokus drill taktis, dan informasikan detail ke murid secara instan.
          </p>

          {!isAdding ? (
            <button
              id="btn-open-add-practice"
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-widest text-[11px]"
            >
              <Plus className="w-4 h-4" />
              Buat Jadwal Baru
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-[#2a2a35] relative z-10">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Judul Latihan</label>
                <input
                  id="input-practice-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Drill Tembakan"
                  className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 placeholder-slate-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Tanggal</label>
                  <input
                    id="input-practice-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Waktu</label>
                  <input
                    id="input-practice-time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Lokasi Lapangan</label>
                <input
                  id="input-practice-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Astra Arena, Court A"
                  className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 placeholder-slate-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Fokus Drill</label>
                  <select
                    id="select-practice-focus"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value as PracticeSession['focus'])}
                    className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="Dribbling">Dribbling</option>
                    <option value="Shooting">Shooting</option>
                    <option value="Passing">Passing</option>
                    <option value="Defense">Defense</option>
                    <option value="Stamina & Tactics">Stamina & Taktik</option>
                    <option value="Scrimmage">Scrimmage Game</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Kepala Pelatih</label>
                  <input
                    id="input-practice-coach"
                    type="text"
                    required
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Deskripsi & Catatan</label>
                <textarea
                  id="textarea-practice-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Bawa jersey merah, pelajari playbook..."
                  className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 placeholder-slate-600 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="w-1/3 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-[#1c1c28] hover:bg-[#2a2a35] rounded-xl transition-all cursor-pointer border border-[#2a2a35]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                >
                  {formSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      Berhasil!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Rilis Jadwal
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Informational Widget */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Sparkles className="w-24 h-24 text-orange-500" />
          </div>
          <span className="text-[10px] text-orange-400 font-bold block uppercase tracking-widest mb-2 relative z-10">Catatan Coach Harian</span>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic relative z-10">
            "Semua atlet diwajibkan melakukan pemanasan (dynamic stretching) minimal 15 menit sebelum waktu latihan yang tertera di jadwal harian."
          </p>
        </div>
      </div>

      {/* RIGHT: Practice Schedule Cards (8 columns) */}
      <div className="lg:col-span-8 flex flex-col gap-5" id="schedule-timeline">
        
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Latihan Terjadwal <span className="text-orange-500">({sortedSchedule.length})</span></span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Hari Ini: <strong className="text-white font-bold ml-1">Jumat, 26 Juni 2026</strong></span>
        </div>

        {/* Schedule grid timeline cards */}
        <div className="space-y-4">
          {sortedSchedule.map((session) => {
            const daysLeft = getDaysRemaining(session.date);
            const isFinished = daysLeft === 'Selesai';
            
            return (
              <div
                key={session.id}
                id={`card-schedule-${session.id}`}
                className={`bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 shadow-lg transition-all relative overflow-hidden flex flex-col md:flex-row gap-6 ${
                  session.completed ? 'opacity-50' : 'hover:border-slate-600'
                }`}
              >
                {/* Visual focus ribbon accent */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  session.focus === 'Dribbling' ? 'bg-orange-400' :
                  session.focus === 'Shooting' ? 'bg-orange-500' :
                  session.focus === 'Passing' ? 'bg-yellow-500' :
                  session.focus === 'Defense' ? 'bg-blue-500' :
                  session.focus === 'Stamina & Tactics' ? 'bg-red-500' :
                  'bg-purple-500'
                }`} />

                {/* Left: Focus Badge & Date */}
                <div className="md:w-40 shrink-0 flex flex-col justify-between pl-3">
                  <div className="space-y-3">
                    <span className={`inline-block text-[9px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-widest ${
                      session.focus === 'Dribbling' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      session.focus === 'Shooting' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      session.focus === 'Passing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                      session.focus === 'Defense' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      session.focus === 'Stamina & Tactics' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {session.focus}
                    </span>
                    <div className="text-white font-bold">
                      <span className="text-sm block font-black leading-tight mb-1">{new Date(session.date).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight font-bold tracking-widest">{session.date}</span>
                    </div>
                  </div>

                  {/* Days remaining badge */}
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-inner ${
                      daysLeft === 'Hari Ini' ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' :
                      daysLeft === 'Besok' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                      isFinished ? 'bg-[#1c1c28] text-slate-500 border-[#2a2a35] shadow-none' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {daysLeft}
                    </span>
                  </div>
                </div>

                {/* Right: Detailed text & controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className={`text-base font-black tracking-wide ${session.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {session.title}
                      </h5>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      {session.description || 'Sesi latihan rutin untuk mengasah performa atlet.'}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Pukul {session.time} WIB</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                        <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{session.coach}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle completion */}
                  <div className="mt-5 pt-4 border-t border-[#2a2a35] flex justify-end">
                    <button
                      id={`btn-complete-practice-${session.id}`}
                      onClick={() => onToggleCompletePractice(session.id)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                        session.completed 
                          ? 'bg-[#1c1c28] text-slate-500 border border-[#2a2a35]' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {session.completed ? 'Latihan Selesai' : 'Tandai Selesai'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
