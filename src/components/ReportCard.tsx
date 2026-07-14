/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Student } from '../types';
import { Trophy, Download, Send, Calendar, Medal, Award, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface ReportCardProps {
  students: Student[];
  selectedStudentId: string;
  onSendNotification: (studentId: string, title: string, message: string, type: 'attendance' | 'report_card' | 'schedule' | 'general') => void;
  savedCards?: any[];
}

export default function ReportCard({
  students,
  selectedStudentId,
  onSendNotification,
  savedCards = [],
}: ReportCardProps) {
  const student = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [importedCardId, setImportedCardId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync state on student change
  React.useEffect(() => {
    setIsSent(false);
    setDownloadSuccess(false);

    // Auto-select card if exists for this student
    const autoCard = savedCards.find(c => c.studentId === student.id);
    if (autoCard) {
      setImportedCardId(autoCard.id);
    } else {
      setImportedCardId(null);
    }
  }, [student, savedCards]);

  const averageScore = useMemo(() => {
    if (!student) return 0;
    const total = (Object.values(student.skills) as number[]).reduce((a, b) => a + b, 0);
    return Math.round((total / 6) * 10) / 10;
  }, [student]);

  const letterGrade = useMemo(() => {
    if (averageScore >= 85) return { grade: 'A', text: 'Sangat Baik (Excellent)', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (averageScore >= 75) return { grade: 'B', text: 'Baik (Good)', color: 'text-amber-500', bg: 'bg-amber-50' };
    if (averageScore >= 60) return { grade: 'C', text: 'Cukup (Fair)', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { grade: 'D', text: 'Butuh Latihan (Underperforming)', color: 'text-rose-500', bg: 'bg-rose-50' };
  }, [averageScore]);

  const attendanceRate = useMemo(() => {
    if (!student) return 100;
    const history = Object.values(student.attendanceHistory);
    if (history.length === 0) return 100;
    const attended = history.filter(status => status === 'present' || status === 'late').length;
    return Math.round((attended / history.length) * 100);
  }, [student]);

  if (!student) {
    return (
      <div className="neu-flat p-12 shadow-lg text-center text-secondary text-sm font-medium">
        Pilih atau tambahkan siswa baru untuk melihat rapor.
      </div>
    );
  }

  const skills = student.skills;

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
      const elWidth = certificateElement.scrollWidth;
      const elHeight = certificateElement.scrollHeight;
      
      const imgData = await toPng(certificateElement, {
        pixelRatio: 2, // Higher resolution
        backgroundColor: '#13131a', // Match the dark theme background
        filter: (node) => {
          if (node && node.classList && node.classList.contains('hide-on-print')) {
            return false;
          }
          return true;
        },
        width: elWidth,
        height: elHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0',
        }
      });

      const pdf = new jsPDF({
        orientation: elWidth > elHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [elWidth, elHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, elWidth, elHeight);
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
        <div className="neu-flat p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy className="w-32 h-32 text-blue-500 transform rotate-12" />
          </div>
          
          <h4 className="text-sm font-black text-primary mb-2 flex items-center gap-2 tracking-wide">
            <Trophy className="w-5 h-5 text-blue-500" />
            Kontrol Dokumen
          </h4>
          <p className="text-[11px] text-secondary mb-6 leading-relaxed font-medium">
            Rapor ini mengombinasikan statistik teknis lapangan, riwayat kehadiran harian, dan evaluasi kepribadian murid untuk diserahkan ke wali murid.
          </p>

          <div className="space-y-4 relative z-10">
            <button
              id="btn-download-txt-report"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 neu-pressed hover:bg-secondary border-theme text-primary font-bold py-3.5 px-4 rounded-xl border border-theme shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-widest text-[10px]"
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
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-orange-600 hover:from-orange-400 hover:to-blue-500 text-primary font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-widest text-[10px]"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Mengirim...
                </>
              ) : isSent ? (
                <>
                  <CheckCircle className="w-4 h-4 text-primary" />
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
                  <strong className="block font-bold text-primary mb-1">Pemberitahuan Berhasil Dikirim!</strong>
                  Rapor <strong className="text-primary">{student.name}</strong> telah dikirim ke wali murid (<span className="font-mono text-emerald-300">{student.parentName}</span>) melalui gateway WhatsApp simulasi.
                </div>
              </motion.div>
            )}

            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 p-4 neu-button-accent/10 border border-blue-500/30 text-blue-400 rounded-xl text-[11px] flex items-start gap-3 shadow-lg font-medium"
              >
                <div className="neu-button-accent/20 p-1 rounded-lg text-blue-500 shrink-0">📂</div>
                <div>
                  <strong className="block font-bold text-primary mb-1">File Laporan Dibuat!</strong>
                  File <span className="font-mono text-blue-300">RAPOR_BASKET_{student.name.replace(/\s+/g, '_').toUpperCase()}.pdf</span> berhasil diunduh ke komputer Anda.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verification Certificate Info Card */}
        <div className="neu-button-accent/10 border border-blue-500/30 rounded-3xl p-5 md:p-6 text-[11px] text-slate-300 space-y-3 relative overflow-hidden shadow-lg">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Award className="w-24 h-24 text-blue-500" />
          </div>
          <h5 className="font-bold flex items-center gap-2 text-primary uppercase tracking-widest relative z-10">
            <Award className="w-5 h-5 text-blue-500" /> Status Sertifikasi
          </h5>
          <p className="leading-relaxed font-medium relative z-10">
            Rapor ini bersifat digital-authoritative. Nilai diperbarui langsung oleh Kepala Pelatih berlisensi DBL Academy / FIBA Coach berdasarkan performa fisik dan tanding taktis atlet di setiap sesi tanding.
          </p>
        </div>
      </div>

      {/* Modern 3D Report Card Certificate (8 columns) */}
      <div className="xl:col-span-8 flex justify-center" id="certificate-container">
        <div id="certificate-board" className="w-full max-w-2xl neu-flat p-6 md:p-10 shadow-lg relative overflow-hidden bg-[radial-gradient(#2a2a35_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Basket court visual grid overlay (Subtle background) */}
          <div className="absolute inset-0 border border-theme m-4 pointer-events-none rounded-2xl flex items-center justify-center">
            {/* Center court circle */}
            <div className="w-44 h-44 rounded-full border border-theme flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-theme"></div>
            </div>
            {/* Split court line */}
            <div className="absolute inset-y-0 left-1/2 border-l border-theme"></div>
          </div>

          {/* Certificate Board Border */}
          <div className="absolute inset-2 border border-theme/50 rounded-[22px] pointer-events-none"></div>

          {/* Header */}
          <div className="text-center relative z-10 space-y-3 mb-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-1 neu-button-accent rounded-full"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">AKADEMI BOLA BASKET NASIONAL</span>
              <div className="w-12 h-1 neu-button-accent rounded-full"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight uppercase flex items-center justify-center gap-3">
              <Medal className="w-8 h-8 text-blue-500" />
              RAPORT EVALUASI ATLET
            </h1>
            <p className="text-xs text-secondary italic max-w-sm mx-auto">
              Diterbitkan secara resmi untuk mencatat pencapaian, keterampilan teknis, dan catatan fisik atlet bola basket remaja.
            </p>
          </div>

                    {/* Imported Card Display */}
          {importedCardId ? (() => {
            const card = savedCards.find(c => c.id === importedCardId);
            if (!card) return null;
            return (
              <div className="relative z-10 flex flex-col items-center mb-8">
                <img src={card.avatar || card.fullBodyPhoto} alt={card.name} className="w-full max-w-[400px] h-auto rounded-3xl border-4 border-theme shadow-2xl" />
                <button 
                  onClick={() => setImportedCardId(null)}
                  className="hide-on-print mt-4 text-[10px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 hover:text-rose-400 px-4 py-2 rounded-xl transition-colors"
                >
                  Ganti Kartu
                </button>
              </div>
            );
          })() : (
            <div className="hide-on-print relative z-10 bg-primary/80 p-8 rounded-2xl border border-theme shadow-inner backdrop-blur-sm mb-8 flex flex-col items-center text-center">
              <Download className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Import Kartu Siswa</h3>
              <p className="text-xs text-secondary mb-6 max-w-sm mx-auto">Untuk melengkapi rapor ini, silakan import kartu atlet yang sudah di-generate dari daftar kartu tersimpan.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                {savedCards.filter(c => c.studentId === student.id).length > 0 ? (
                  savedCards.filter(c => c.studentId === student.id).map(card => (
                    <button
                      key={card.id}
                      onClick={() => setImportedCardId(card.id)}
                      className="px-4 py-3 neu-pressed border border-theme rounded-xl hover:border-blue-500/50 hover:neu-button-accent/10 transition-colors text-left flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-black overflow-hidden border border-theme">
                        {card.avatar ? <img src={card.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">👤</div>}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-primary group-hover:text-blue-400 truncate">{card.name}</div>
                        <div className="text-[9px] text-secondary uppercase tracking-widest truncate">{card.position}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-xs text-secondary italic p-4 border border-dashed border-theme rounded-xl text-center">
                    Belum ada kartu tersimpan untuk atlet ini. Silakan generate dan simpan kartu atlet ini di tab Generator Siswa terlebih dahulu.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Coach Feedback inside certificate */}
          <div className="relative z-10 bg-primary/80 p-6 rounded-2xl border border-theme shadow-inner backdrop-blur-sm mb-10 text-[11px] text-slate-300">
            <span className="text-blue-400 block font-bold uppercase text-[9px] tracking-widest mb-2">Catatan Kepala Pelatih (Coach's Assessment)</span>
            <p className="font-medium text-slate-300 leading-relaxed italic">
              "{student.notes || 'Atlet menunjukkan disiplin latihan yang sangat memuaskan, kemauan belajar teknik baru tinggi, dan memiliki kontribusi teamwork yang solid.'}"
            </p>
          </div>

          {/* Footer - Signatures */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-secondary pt-6 border-t border-dashed border-theme uppercase tracking-widest font-bold">
            <div className="text-center md:text-left">
              <span className="block mb-1">Tanggal Terbit: <strong className="text-primary">{new Date().toLocaleDateString('id-ID')}</strong></span>
              <span className="block text-[8px] text-slate-600">Basketball Academy Database</span>
            </div>

            <div className="text-center flex flex-col items-center">
              <span className="text-[8px] text-slate-600 mb-2">Mengesahkan,</span>
              <div className="h-12 flex items-center justify-center relative">
                {/* Fake signature graphics */}
                <svg className="w-28 h-10 text-blue-500/50 transform -rotate-6" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10,25 C30,5 40,5 60,15 C80,25 70,5 90,15" />
                  <path d="M20,15 L80,15" />
                </svg>
                {/* Gold seal stamp overlay */}
                <div className="absolute right-[-20px] top-[-5px] w-14 h-14 neu-button-accent/10 border border-blue-500/30 rounded-full flex items-center justify-center transform rotate-12 select-none pointer-events-none backdrop-blur-sm">
                  <span className="text-[6px] font-black text-blue-400 uppercase tracking-widest text-center leading-tight">VERIFIED<br/>COACH</span>
                </div>
              </div>
              <span className="font-bold text-primary border-t border-theme pt-2 mt-2">Coach Andi Wardana</span>
              <span className="text-[8px] text-blue-400 block mt-0.5">Kepala Pelatih Lisensi A</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
