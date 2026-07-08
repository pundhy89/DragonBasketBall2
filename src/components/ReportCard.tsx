/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Student } from '../types';
import { Trophy, Download, Send, Calendar, Medal, Award, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportCardProps {
  students: Student[];
  selectedStudentId: string;
  onSendNotification: (studentId: string, title: string, message: string, type: 'attendance' | 'report_card' | 'schedule' | 'general') => void;
}

export default function ReportCard({
  students,
  selectedStudentId,
  onSendNotification
}: ReportCardProps) {
  const student = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync state on student change
  React.useEffect(() => {
    setIsSent(false);
    setDownloadSuccess(false);
  }, [student]);

  const skills = student.skills;

  const averageScore = useMemo(() => {
    const total = (Object.values(skills) as number[]).reduce((a, b) => a + b, 0);
    return Math.round((total / 6) * 10) / 10;
  }, [skills]);

  const letterGrade = useMemo(() => {
    if (averageScore >= 85) return { grade: 'A', text: 'Sangat Baik (Excellent)', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (averageScore >= 75) return { grade: 'B', text: 'Baik (Good)', color: 'text-amber-500', bg: 'bg-amber-50' };
    if (averageScore >= 60) return { grade: 'C', text: 'Cukup (Fair)', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { grade: 'D', text: 'Butuh Latihan (Underperforming)', color: 'text-rose-500', bg: 'bg-rose-50' };
  }, [averageScore]);

  const attendanceRate = useMemo(() => {
    const history = Object.values(student.attendanceHistory);
    if (history.length === 0) return 100;
    const attended = history.filter(status => status === 'present' || status === 'late').length;
    return Math.round((attended / history.length) * 100);
  }, [student]);

  const handleSendNotification = () => {
    setIsSending(true);
    setTimeout(() => {
      const message = `Halo Bpk/Ibu ${student.parentName}, Rapor Perkembangan Basketball untuk ${student.name} bulan ini telah terbit dengan Nilai Rata-Rata ${averageScore} (${letterGrade.grade} - ${letterGrade.text}). Kehadiran: ${attendanceRate}%. Catatan pelatih: "${student.notes}"`;
      onSendNotification(student.id, 'Rapor Bulanan Basketball Terbit', message, 'report_card');
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1200);
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      const certificateElement = document.getElementById('certificate-board');
      if (!certificateElement) {
        throw new Error('Certificate element not found');
      }

      // Hide anything that shouldn't be in the PDF if needed
      
      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Higher resolution
        backgroundColor: '#13131a', // Match the dark theme background
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RAPOR_BASKET_${student.name.replace(/\s+/g, '_').toUpperCase()}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="report-card-workspace">
      
      {/* Action Controls Side Card (4 columns) */}
      <div className="xl:col-span-4 flex flex-col gap-5">
        <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy className="w-32 h-32 text-orange-500 transform rotate-12" />
          </div>
          
          <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2 tracking-wide">
            <Trophy className="w-5 h-5 text-orange-500" />
            Kontrol Dokumen
          </h4>
          <p className="text-[11px] text-slate-400 mb-6 leading-relaxed font-medium">
            Rapor ini mengombinasikan statistik teknis lapangan, riwayat kehadiran harian, dan evaluasi kepribadian murid untuk diserahkan ke wali murid.
          </p>

          <div className="space-y-4 relative z-10">
            <button
              id="btn-download-txt-report"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 bg-[#1c1c28] hover:bg-[#2a2a35] text-white font-bold py-3.5 px-4 rounded-xl border border-[#2a2a35] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-widest text-[10px]"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Mengunduh...
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Rapor Terunduh!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Simpan & Unduh (.pdf)
                </>
              )}
            </button>

            <button
              id="btn-send-report-notification"
              onClick={handleSendNotification}
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-widest text-[10px]"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Mengirim...
                </>
              ) : isSent ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  Berhasil Terkirim!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim ke Orang Tua (WA)
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {isSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[11px] flex items-start gap-3 shadow-lg font-medium"
              >
                <div className="bg-emerald-500/20 p-1 rounded-lg text-emerald-500 shrink-0">✅</div>
                <div>
                  <strong className="block font-bold text-white mb-1">Pemberitahuan Berhasil Dikirim!</strong>
                  Rapor <strong className="text-white">{student.name}</strong> telah dikirim ke wali murid (<span className="font-mono text-emerald-300">{student.parentName}</span>) melalui gateway WhatsApp simulasi.
                </div>
              </motion.div>
            )}

            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 p-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl text-[11px] flex items-start gap-3 shadow-lg font-medium"
              >
                <div className="bg-blue-500/20 p-1 rounded-lg text-blue-500 shrink-0">📂</div>
                <div>
                  <strong className="block font-bold text-white mb-1">File Laporan Dibuat!</strong>
                  File <span className="font-mono text-blue-300">RAPOR_BASKET_{student.name.replace(/\s+/g, '_').toUpperCase()}.pdf</span> berhasil diunduh ke komputer Anda.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verification Certificate Info Card */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-3xl p-5 md:p-6 text-[11px] text-slate-300 space-y-3 relative overflow-hidden shadow-lg">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Award className="w-24 h-24 text-orange-500" />
          </div>
          <h5 className="font-bold flex items-center gap-2 text-white uppercase tracking-widest relative z-10">
            <Award className="w-5 h-5 text-orange-500" /> Status Sertifikasi
          </h5>
          <p className="leading-relaxed font-medium relative z-10">
            Rapor ini bersifat digital-authoritative. Nilai diperbarui langsung oleh Kepala Pelatih berlisensi DBL Academy / FIBA Coach berdasarkan performa fisik dan tanding taktis atlet di setiap sesi tanding.
          </p>
        </div>
      </div>

      {/* Modern 3D Report Card Certificate (8 columns) */}
      <div className="xl:col-span-8 flex justify-center" id="certificate-container">
        <div id="certificate-board" className="w-full max-w-2xl bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden bg-[radial-gradient(#2a2a35_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Basket court visual grid overlay (Subtle background) */}
          <div className="absolute inset-0 border border-[#2a2a35] m-4 pointer-events-none rounded-2xl flex items-center justify-center">
            {/* Center court circle */}
            <div className="w-44 h-44 rounded-full border border-[#2a2a35] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-[#2a2a35]"></div>
            </div>
            {/* Split court line */}
            <div className="absolute inset-y-0 left-1/2 border-l border-[#2a2a35]"></div>
          </div>

          {/* Certificate Board Border */}
          <div className="absolute inset-2 border border-[#2a2a35]/50 rounded-[22px] pointer-events-none"></div>

          {/* Header */}
          <div className="text-center relative z-10 space-y-3 mb-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">AKADEMI BOLA BASKET NASIONAL</span>
              <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase flex items-center justify-center gap-3">
              <Medal className="w-8 h-8 text-orange-500" />
              RAPORT EVALUASI ATLET
            </h1>
            <p className="text-xs text-slate-500 italic max-w-sm mx-auto">
              Diterbitkan secara resmi untuk mencatat pencapaian, keterampilan teknis, dan catatan fisik atlet bola basket remaja.
            </p>
          </div>

          {/* Student Profile Info Row */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-[#2a2a35] bg-[#0B0A10]/80 backdrop-blur-sm shadow-inner mb-8 text-[11px] text-slate-300 uppercase tracking-widest">
            <div>
              <span className="text-slate-500 block font-bold text-[9px] mb-1">Nama Lengkap</span>
              <strong className="text-white text-xs font-black">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[9px] mb-1">Posisi Bermain</span>
              <strong className="text-orange-400 text-xs font-black">{student.position}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[9px] mb-1">Fisik (T/B)</span>
              <strong className="text-white text-xs font-black">{student.height} cm / {student.weight} kg</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[9px] mb-1">Kehadiran</span>
              <strong className="text-emerald-400 text-xs font-black">{attendanceRate}% Hadir</strong>
            </div>
          </div>

          {/* Skills Grades Panel */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Skill list inside the certificate */}
            <div className="space-y-4 bg-[#0B0A10]/80 p-6 rounded-2xl border border-[#2a2a35] shadow-inner backdrop-blur-sm">
              <h5 className="text-[10px] font-bold uppercase text-slate-400 border-b border-[#2a2a35] pb-3 mb-4 tracking-widest flex items-center justify-between">
                <span>Evaluasi Keterampilan</span>
                <span className="text-slate-500">Skor</span>
              </h5>
              
              {Object.entries(skills).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                  <span className="w-20">{key}</span>
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div className="w-full max-w-[100px] bg-[#1c1c28] h-1.5 rounded-full overflow-hidden hidden md:block border border-[#2a2a35]/50">
                      <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-full rounded-full" style={{ width: `${value}%` }} />
                    </div>
                    <span className="font-mono bg-[#1c1c28] border border-[#2a2a35] px-2.5 py-1 rounded-md text-orange-400 w-9 text-center shadow-inner">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Summary Stamp (Big Grade Shield) */}
            <div className="bg-[#0B0A10]/80 p-6 rounded-2xl border border-[#2a2a35] shadow-inner backdrop-blur-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-3">Grade Keseluruhan</span>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-[6px] border-[#13131a] flex items-center justify-center text-white font-black text-5xl shadow-[0_0_20px_rgba(249,115,22,0.3)] relative z-10 mb-2">
                {letterGrade.grade}
              </div>
              <h4 className="text-xs font-black text-white mt-3 leading-none uppercase tracking-widest">{letterGrade.text}</h4>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Rata-rata Skor: <strong className="text-orange-400">{averageScore} / 100</strong></p>

              <div className="mt-5 pt-4 border-t border-[#2a2a35] w-full text-[9px] text-slate-500 flex justify-around uppercase tracking-widest">
                <div>
                  <span className="block font-bold text-white mb-0.5">C-And-Shoot</span>
                  <span className="text-emerald-400">90%</span>
                </div>
                <div className="border-l border-[#2a2a35]"></div>
                <div>
                  <span className="block font-bold text-white mb-0.5">Ball Security</span>
                  <span className="text-emerald-400">85%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Coach Feedback inside certificate */}
          <div className="relative z-10 bg-[#0B0A10]/80 p-6 rounded-2xl border border-[#2a2a35] shadow-inner backdrop-blur-sm mb-10 text-[11px] text-slate-300">
            <span className="text-orange-400 block font-bold uppercase text-[9px] tracking-widest mb-2">Catatan Kepala Pelatih (Coach's Assessment)</span>
            <p className="font-medium text-slate-300 leading-relaxed italic">
              "{student.notes || 'Atlet menunjukkan disiplin latihan yang sangat memuaskan, kemauan belajar teknik baru tinggi, dan memiliki kontribusi teamwork yang solid.'}"
            </p>
          </div>

          {/* Footer - Signatures */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 pt-6 border-t border-dashed border-[#2a2a35] uppercase tracking-widest font-bold">
            <div className="text-center md:text-left">
              <span className="block mb-1">Tanggal Terbit: <strong className="text-white">{new Date().toLocaleDateString('id-ID')}</strong></span>
              <span className="block text-[8px] text-slate-600">Basketball Academy Database</span>
            </div>

            <div className="text-center flex flex-col items-center">
              <span className="text-[8px] text-slate-600 mb-2">Mengesahkan,</span>
              <div className="h-12 flex items-center justify-center relative">
                {/* Fake signature graphics */}
                <svg className="w-28 h-10 text-orange-500/50 transform -rotate-6" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10,25 C30,5 40,5 60,15 C80,25 70,5 90,15" />
                  <path d="M20,15 L80,15" />
                </svg>
                {/* Gold seal stamp overlay */}
                <div className="absolute right-[-20px] top-[-5px] w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center transform rotate-12 select-none pointer-events-none backdrop-blur-sm">
                  <span className="text-[6px] font-black text-orange-400 uppercase tracking-widest text-center leading-tight">VERIFIED<br/>COACH</span>
                </div>
              </div>
              <span className="font-bold text-white border-t border-[#2a2a35] pt-2 mt-2">Coach Andi Wardana</span>
              <span className="text-[8px] text-orange-400 block mt-0.5">Kepala Pelatih Lisensi A</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
