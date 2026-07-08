/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Coach } from '../types';

export const INITIAL_COACHES: Coach[] = [
  {
    id: 'c_1',
    name: 'Coach Andi Wardana',
    role: 'Kepala Instruktur',
    avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format&fit=crop', // placeholder athlete
    specialty: 'Taktik Tim & Penyerangan (Offense)',
    experience: '12+ Tahun Melatih',
    certification: 'Lisensi A FIBA'
  },
  {
    id: 'c_2',
    name: 'Coach Denny Kurniawan',
    role: 'Pelatih Kondisi & Fisik',
    avatar: '💪',
    specialty: 'Ketahanan Fisik & Atletis (Physical)',
    experience: '8 Tahun Melatih Fisik',
    certification: 'Sertifikasi Strength & Conditioning'
  },
  {
    id: 'c_3',
    name: 'Coach Sarah Wijaya',
    role: 'Pelatih Fundamental Junior',
    avatar: '⚡',
    specialty: 'Dribbling & Footwork (Ball Handling)',
    experience: '5 Tahun Melatih Junior',
    certification: 'Lisensi C Nasional'
  },
  {
    id: 'c_4',
    name: 'Coach Rian Hidayat',
    role: 'Pelatih Sektor Pertahanan',
    avatar: '🛡️',
    specialty: 'Defensive Lockdown & Rebounding (Defense)',
    experience: '7 Tahun Melatih',
    certification: 'Lisensi B Nasional'
  },
  {
    id: 'c_5',
    name: 'Coach Budi Prasetyo',
    role: 'Pelatih Menembak',
    avatar: '🎯',
    specialty: 'Akurasi Menembak & Lay-up (Shooting)',
    experience: '10 Tahun Melatih',
    certification: 'Lisensi B Nasional'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_1',
    name: 'Bagas Saputra',
    avatar: '🏀',
    age: 15,
    height: 178,
    weight: 68,
    position: 'Point Guard',
    parentName: 'Hendra Saputra',
    parentPhone: '0812-3456-7890',
    parentEmail: 'hendra.saputra@email.com',
    skills: {
      dribbling: 85,
      shooting: 72,
      passing: 88,
      defense: 76,
      physical: 80,
      teamwork: 90
    },
    notes: 'Bagas memiliki visi bermain yang luar biasa sebagai playmaker. Dribble dan passing sangat kuat, namun perlu meningkatkan akurasi tembakan tiga angka (three-point shooting) di bawah tekanan.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'late',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SMP',
    evaluatedBy: 'c_1'
  },
  {
    id: 'std_2',
    name: 'Gavin Wijaya',
    avatar: '⚡',
    age: 16,
    height: 185,
    weight: 75,
    position: 'Shooting Guard',
    parentName: 'Agus Wijaya',
    parentPhone: '0819-8765-4321',
    parentEmail: 'agus.wijaya@email.com',
    skills: {
      dribbling: 78,
      shooting: 92,
      passing: 70,
      defense: 81,
      physical: 85,
      teamwork: 75
    },
    notes: 'Gavin adalah shooter murni dengan rilis tembakan yang sangat cepat. Akurasi catch-and-shoot luar biasa. Sedang melatih drive-to-the-basket dan kelincahan bertahan satu-lawan-satu.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SMA',
    evaluatedBy: 'c_5'
  },
  {
    id: 'std_3',
    name: 'Rafi Ahmad',
    avatar: '🔥',
    age: 15,
    height: 175,
    weight: 62,
    position: 'Small Forward',
    parentName: 'Rudy Ahmad',
    parentPhone: '0852-1122-3344',
    parentEmail: 'rudy.ahmad@email.com',
    skills: {
      dribbling: 82,
      shooting: 78,
      passing: 75,
      defense: 85,
      physical: 88,
      teamwork: 82
    },
    notes: 'Pemain serba bisa yang ulet. Rafi sangat tangguh dalam pertahanan (defensive lockdown) dan transisi cepat. Perlu memperhalus kontrol bola saat melakukan crossover dengan tangan kiri.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'sick',
      '2026-06-23': 'sick',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SMP',
    evaluatedBy: 'c_4'
  },
  {
    id: 'std_4',
    name: 'Aditya Pratama',
    avatar: '🛡️',
    age: 16,
    height: 191,
    weight: 84,
    position: 'Center',
    parentName: 'Bambang Pratama',
    parentPhone: '0813-9988-7766',
    parentEmail: 'bambang.pratama@email.com',
    skills: {
      dribbling: 45,
      shooting: 65,
      passing: 60,
      defense: 90,
      physical: 92,
      teamwork: 85
    },
    notes: 'Aditya menguasai paint-area. Kemampuan rebound dan blok tembakan sangat superior. Sedang fokus melatih post-move (hook shot dan drop-step) serta meningkatkan persentase free-throw.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SMA',
    evaluatedBy: 'c_2'
  },
  {
    id: 'std_5',
    name: 'Faisal Ramadhan',
    avatar: '👟',
    age: 14,
    height: 172,
    weight: 58,
    position: 'Point Guard',
    parentName: 'Iwan Ramadhan',
    parentPhone: '0878-5544-3322',
    parentEmail: 'iwan.ramadhan@email.com',
    skills: {
      dribbling: 80,
      shooting: 70,
      passing: 82,
      defense: 68,
      physical: 72,
      teamwork: 88
    },
    notes: 'Faisal adalah pemain termuda di skuad inti. Memiliki kecepatan lari dan kelincahan yang sangat baik. Sangat patuh pada taktik tim, perlu menambah massa otot (physical strength) untuk duel fisik.',
    attendanceHistory: {
      '2026-06-21': 'absent',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SMP',
    evaluatedBy: 'c_3'
  },
  {
    id: 'std_6',
    name: 'Nadia Putri',
    avatar: '🌟',
    age: 15,
    height: 174,
    weight: 60,
    position: 'Power Forward',
    parentName: 'Yusuf Putri',
    parentPhone: '0811-2233-4455',
    parentEmail: 'yusuf.putri@email.com',
    skills: {
      dribbling: 70,
      shooting: 80,
      passing: 78,
      defense: 83,
      physical: 78,
      teamwork: 92
    },
    notes: 'Nadia memiliki mentalitas pemenang dan komunikasi tim yang vokal. Sangat handal dalam melakukan screen-and-roll. Memiliki akurasi mid-range jumper yang stabil dan defense serbaguna.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'late',
      '2026-06-25': 'present'
    },
    classLevel: 'SMP',
    evaluatedBy: 'c_1'
  },
  {
    id: 'std_7',
    name: 'Rian Perkasa',
    avatar: '👶',
    age: 8,
    height: 128,
    weight: 29,
    position: 'Point Guard',
    parentName: 'Deni Perkasa',
    parentPhone: '0812-7766-5544',
    parentEmail: 'deni.perkasa@email.com',
    skills: {
      dribbling: 45,
      shooting: 32,
      passing: 50,
      defense: 35,
      physical: 42,
      teamwork: 65
    },
    notes: 'Rian sangat bersemangat di kelas SD Lower. Fokus latihan adalah koordinasi mata-tangan dasar, teknik memantulkan bola statis, dan cara memegang bola (grip) yang benar.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SD Lower',
    evaluatedBy: 'c_3'
  },
  {
    id: 'std_8',
    name: 'Dika Pratama',
    avatar: '🧒',
    age: 10,
    height: 142,
    weight: 37,
    position: 'Shooting Guard',
    parentName: 'Andi Pratama',
    parentPhone: '0813-2211-0099',
    parentEmail: 'andi.pratama@email.com',
    skills: {
      dribbling: 62,
      shooting: 58,
      passing: 60,
      defense: 52,
      physical: 58,
      teamwork: 72
    },
    notes: 'Dika di kelas SD Berkembang menunjukkan kemajuan pesat dalam form shooting-nya. Sedang memperlancar teknik dribbling dinamis sembari berjalan dan berlari kecil.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SD Berkembang',
    evaluatedBy: 'c_5'
  },
  {
    id: 'std_9',
    name: 'Shanti Olivia',
    avatar: '👧',
    age: 12,
    height: 154,
    weight: 43,
    position: 'Small Forward',
    parentName: 'Budi Olivia',
    parentPhone: '0815-3344-5566',
    parentEmail: 'budi.olivia@email.com',
    skills: {
      dribbling: 68,
      shooting: 62,
      passing: 66,
      defense: 65,
      physical: 60,
      teamwork: 78
    },
    notes: 'Shanti di kelas SD Upper memiliki komunikasi tim yang menonjol. Perlu melatih kecepatan rebound, transisi bertahan, serta akurasi lay-up kiri.',
    attendanceHistory: {
      '2026-06-21': 'present',
      '2026-06-22': 'present',
      '2026-06-23': 'present',
      '2026-06-24': 'present',
      '2026-06-25': 'present'
    },
    classLevel: 'SD Upper',
    evaluatedBy: 'c_1'
  }
];

export const INITIAL_SCHEDULE: import('../types').PracticeSession[] = [
  {
    id: 'prac_1',
    title: 'Latihan Rutin: Fundamental & Ball Handling',
    date: '2026-06-27',
    time: '15:30',
    location: 'Astra Arena, Court A',
    focus: 'Dribbling',
    coach: 'Coach Sarah Wijaya',
    description: 'Fokus pada teknik dribble rendah, crossover, and drible statis menggunakan kedua tangan. Dilanjutkan latihan penetrasi lay-up.',
    completed: false
  },
  {
    id: 'prac_2',
    title: 'Latihan Menembak & Catch and Shoot',
    date: '2026-06-29',
    time: '16:00',
    location: 'Astra Arena, Court B',
    focus: 'Shooting',
    coach: 'Coach Budi Prasetyo',
    description: 'Drill tembakan jarak menengah, catch & shoot dari wing, free-throw routine, dan taktik offensive spacing.',
    completed: false
  },
  {
    id: 'prac_3',
    title: 'Sparing Internal & Strategi Bertahan',
    date: '2026-07-02',
    time: '15:30',
    location: 'Astra Arena, Court A',
    focus: 'Defense',
    coach: 'Coach Rian Hidayat',
    description: 'Simulasi pertahanan zone defense 2-3 dan man-to-man full court press. Diakhiri dengan sparing game 4x10 menit.',
    completed: false
  }
];

export const INITIAL_NOTIFICATIONS: import('../types').ParentNotification[] = [
  {
    id: 'notif_1',
    studentId: 'std_3',
    studentName: 'Rafi Ahmad',
    parentName: 'Rudy Ahmad',
    parentPhone: '0852-1122-3344',
    title: 'Pemberitahuan Sakit Terkonfirmasi',
    message: 'Halo Bpk. Rudy Ahmad, kami telah menerima laporan bahwa Rafi Ahmad tidak dapat mengikuti latihan pada 2026-06-22 karena sakit. Semoga Rafi lekas sembuh.',
    timestamp: '2026-06-22T09:15:00.000Z',
    type: 'attendance',
    channel: 'WhatsApp',
    status: 'sent'
  },
  {
    id: 'notif_2',
    studentId: 'std_1',
    studentName: 'Bagas Saputra',
    parentName: 'Hendra Saputra',
    parentPhone: '0812-3456-7890',
    title: 'Rapor Evaluasi Bulanan Bola Basket',
    message: 'Halo Bpk. Hendra Saputra, rapor latihan bulanan untuk Bagas Saputra telah diterbitkan dengan nilai rata-rata 82.6 (Kategori: Amat Baik). Silakan cek di aplikasi.',
    timestamp: '2026-06-25T17:00:00.000Z',
    type: 'report_card',
    channel: 'WhatsApp',
    status: 'sent'
  }
];
