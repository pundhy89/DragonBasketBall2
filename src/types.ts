/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentSkills {
  dribbling: number; // 0 - 100
  shooting: number;  // 0 - 100
  passing: number;   // 0 - 100
  defense: number;   // 0 - 100
  physical: number;  // 0 - 100
  teamwork: number;  // 0 - 100
}

export interface Student {
  id: string;
  name: string;
  avatar: string; // url or keyword
  fullBodyPhoto?: string; // url
  age: number;
  height: number; // cm
  weight: number; // kg
  position: 'Point Guard' | 'Shooting Guard' | 'Small Forward' | 'Power Forward' | 'Center';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  skills: StudentSkills;
  notes: string;
  attendanceHistory: { [date: string]: 'present' | 'absent' | 'sick' | 'late' };
  classLevel: 'SD Lower' | 'SD Berkembang' | 'SD Upper' | 'SMP' | 'SMA';
  evaluatedBy?: string; // ID of the coach who last evaluated
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialty: string;
  experience?: string;
  certification?: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  records: {
    [studentId: string]: 'present' | 'absent' | 'sick' | 'late';
  };
}

export interface PracticeSession {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  focus: 'Dribbling' | 'Shooting' | 'Passing' | 'Defense' | 'Stamina & Tactics' | 'Scrimmage';
  coach: string;
  description: string;
  completed: boolean;
}

export interface ParentNotification {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  type: 'attendance' | 'report_card' | 'schedule' | 'general';
  channel: 'WhatsApp' | 'SMS' | 'Email';
  status: 'sent' | 'pending' | 'failed';
}

export interface TutorialVideo {
  id: string;
  title: string;
  category: 'Dribbling' | 'Shooting' | 'Passing' | 'Defense';
  difficulty: 'Pemula' | 'Menengah' | 'Mahir';
  description: string;
  duration: string;
  videoPlaceholderId: string; // keyword for visual mock video
  steps: string[];
  drills: string[];
  tips: string[];
}

export interface SavedCard {
  id: string;
  studentId: string;
  savedAt: string;
  name: string;
  position: string;
  height: number;
  weight: number;
  age: number;
  attendanceRate: number;
  letterGrade: { grade: string, text: string };
  avatar: string;
  fullBodyPhoto: string;
  parentName: string;
  parentPhone: string;
}
