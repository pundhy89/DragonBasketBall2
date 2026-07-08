/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Student, ParentNotification } from '../types';
import { Send, PhoneCall, Check, MessageSquare, AlertTriangle, ShieldCheck, Mail, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterProps {
  students: Student[];
  notifications: ParentNotification[];
  onSendCustomNotification: (notification: Omit<ParentNotification, 'id' | 'timestamp' | 'status'>) => void;
  onClearLogs: () => void;
}

export default function NotificationCenter({
  students,
  notifications,
  onSendCustomNotification,
  onClearLogs
}: NotificationCenterProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [template, setTemplate] = useState<'attendance' | 'report_card' | 'schedule' | 'general'>('general');
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [customMessage, setCustomMessage] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [successSent, setSuccessSent] = useState(false);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Standard predefined message templates in Indonesian
  const templates = useMemo(() => {
    if (!selectedStudent) return {};
    
    return {
      attendance: {
        title: 'Laporan Absensi Bola Basket',
        message: `Pemberitahuan Basket: Yth Bpk/Ibu ${selectedStudent.parentName}, kami menginformasikan bahwa ${selectedStudent.name} tidak menghadiri sesi latihan rutin hari ini. Mohon berikan konfirmasi ke Coach jika sedang berhalangan hadir.`
      },
      report_card: {
        title: 'Rapor Evaluasi Atlet Basketball',
        message: `Pemberitahuan Basket: Yth Bpk/Ibu ${selectedStudent.parentName}, Rapor Bulanan untuk ananda ${selectedStudent.name} telah diterbitkan dengan hasil evaluasi memuaskan. Silakan cek portal akademi untuk melihat rincian skill radar chart.`
      },
      schedule: {
        title: 'Pembaruan Jadwal Latihan Basket',
        message: `Pemberitahuan Basket: Yth Bpk/Ibu ${selectedStudent.parentName}, mohon perhatian bahwa jadwal latihan bola basket minggu depan mengalami penyesuaian waktu. Detail sesi telah diperbarui di aplikasi.`
      },
      general: {
        title: 'Pengumuman Penting Akademi Basket',
        message: `Halo Bpk/Ibu ${selectedStudent.parentName}, mohon luangkan waktu sebentar untuk membaca pengumuman pendaftaran turnamen liga remaja nasional yang baru kami rilis di mading utama.`
      }
    };
  }, [selectedStudent]);

  // Update text when student or template changes
  React.useEffect(() => {
    if (templates[template]) {
      setCustomTitle(templates[template].title);
      setCustomMessage(templates[template].message);
    }
  }, [selectedStudent, template, templates]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !customTitle || !customMessage) return;

    setIsSending(true);

    setTimeout(() => {
      onSendCustomNotification({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        parentName: selectedStudent.parentName,
        parentPhone: selectedStudent.parentPhone,
        title: customTitle,
        message: customMessage,
        type: template,
        channel: channel
      });

      setIsSending(false);
      setSuccessSent(true);

      setTimeout(() => {
        setSuccessSent(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="notifications-workspace">
      
      {/* LEFT: Notification Composer Form (5 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <MessageSquare className="w-32 h-32 text-orange-500 transform -rotate-12" />
          </div>
          
          <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2 tracking-wide">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Kirim Notifikasi
          </h4>
          <p className="text-[11px] text-slate-400 mb-6 leading-relaxed font-medium">
            Gunakan pengirim terintegrasi untuk menyebarkan laporan absensi mendadak, rilis nilai raport, pengingat iuran bulanan, atau pembaruan jadwal.
          </p>

          <form onSubmit={handleSend} className="space-y-5 pt-4 border-t border-[#2a2a35] relative z-10">
            {/* Student Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Penerima (Wali Murid)</label>
              <select
                id="select-notif-student-recipient"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    Ortu dari: {s.name} ({s.parentName} - {s.parentPhone})
                  </option>
                ))}
              </select>
            </div>

            {/* Template Selector & Channel */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Topik Template</label>
                <select
                  id="select-notif-template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  <option value="attendance">Absensi Latihan</option>
                  <option value="report_card">Raport Skill</option>
                  <option value="schedule">Jadwal Latihan</option>
                  <option value="general">Informasi Umum</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Saluran Kirim</label>
                <select
                  id="select-notif-channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  <option value="WhatsApp">🟢 WhatsApp (Instant)</option>
                  <option value="SMS">🔵 SMS Gateway</option>
                  <option value="Email">🔴 Surat Elektronik</option>
                </select>
              </div>
            </div>

            {/* Title message */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Subjek Pemberitahuan</label>
              <input
                id="input-notif-title"
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Subjek Pemberitahuan"
                className="w-full text-xs p-3 rounded-xl border border-[#2a2a35] bg-[#1c1c28] text-white outline-none focus:border-orange-500 placeholder-slate-600 transition-colors"
              />
            </div>

            {/* Body custom message */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">Isi Pesan Notifikasi</label>
              <textarea
                id="textarea-notif-body"
                required
                rows={5}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full text-xs p-4 rounded-2xl border border-[#2a2a35] bg-[#1c1c28] text-slate-300 outline-none focus:border-orange-500 placeholder-slate-600 transition-colors font-medium leading-relaxed resize-none custom-scrollbar"
              />
            </div>

            {/* Send Button */}
            <button
              id="btn-submit-notif"
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-widest text-[11px]"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Menghubungkan Server...
                </>
              ) : successSent ? (
                <>
                  <Check className="w-4 h-4" />
                  Pesan Terkirim!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Pesan Simulasi
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {successSent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[11px] flex items-center gap-3 shadow-lg font-medium"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Simulasi SMS/WhatsApp berhasil dikirim ke orang tua <strong className="text-white">{selectedStudent?.name}</strong>. Log tercatat di riwayat pengiriman.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Notifications Log History (7 columns) */}
      <div className="lg:col-span-7 flex flex-col gap-5" id="notifications-history">
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Log Riwayat Notifikasi <span className="text-orange-500">({notifications.length})</span></span>
          {notifications.length > 0 && (
            <button
              id="btn-clear-notif-logs"
              onClick={onClearLogs}
              className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-white hover:bg-rose-500/20 bg-transparent border border-rose-500/30 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              Hapus Semua Log
            </button>
          )}
        </div>

        {/* List of Sent Notifications */}
        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="bg-[#1c1c28]/50 border border-[#2a2a35] border-dashed rounded-3xl p-12 text-center text-slate-500 space-y-4">
              <PhoneCall className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
              <div>
                <h5 className="font-bold text-white mb-2 uppercase tracking-widest text-[11px]">Belum Ada Notifikasi Terkirim</h5>
                <p className="text-[11px] max-w-xs mx-auto leading-relaxed">Semua notifikasi absensi dan rapor yang dikirim ke orang tua murid akan tercatat secara detail di panel riwayat log ini.</p>
              </div>
            </div>
          ) : (
            [...notifications].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((notif) => (
              <div
                key={notif.id}
                id={`card-notif-log-${notif.id}`}
                className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-5 shadow-lg space-y-3 relative hover:border-slate-600 transition-colors"
              >
                {/* Meta details */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Penerima: <span className="text-orange-500">{notif.parentName}</span> (Ortu {notif.studentName})</span>
                    <h5 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <span className="text-sm">💬</span>
                      {notif.title}
                    </h5>
                  </div>
                  
                  {/* Channel icon pill */}
                  <span className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${
                    notif.channel === 'WhatsApp' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    notif.channel === 'SMS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  }`}>
                    {notif.channel}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-medium leading-relaxed bg-[#1c1c28] p-4 rounded-2xl border border-[#2a2a35]">
                  {notif.message}
                </p>

                {/* Status and timestamp */}
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500 pt-1">
                  <span>Telp: <strong className="text-slate-400">{notif.parentPhone}</strong></span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sent (Delivered)
                    </span>
                    <span>•</span>
                    <span>{new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
