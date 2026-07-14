import React, { useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Student, PracticeSession, ParentNotification, Coach } from '../types';

export function useFirebaseSync(
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>,
  setSchedule: React.Dispatch<React.SetStateAction<PracticeSession[]>>,
  setNotifications: React.Dispatch<React.SetStateAction<ParentNotification[]>>,
  setCoaches: React.Dispatch<React.SetStateAction<Coach[]>>,
  setSettings: React.Dispatch<React.SetStateAction<any>>
) {
  useEffect(() => {

    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      const data: Student[] = [];
      snapshot.forEach(doc => data.push({ ...doc.data(), id: doc.id } as Student));
      if (data.length > 0) setStudents(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'students'));

    const unsubSchedule = onSnapshot(collection(db, 'practiceSessions'), (snapshot) => {
      const data: PracticeSession[] = [];
      snapshot.forEach(doc => data.push({ ...doc.data(), id: doc.id } as PracticeSession));
      if (data.length > 0) setSchedule(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'practiceSessions'));

    const unsubNotifications = onSnapshot(collection(db, 'parentNotifications'), (snapshot) => {
      const data: ParentNotification[] = [];
      snapshot.forEach(doc => data.push({ ...doc.data(), id: doc.id } as ParentNotification));
      if (data.length > 0) setNotifications(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'parentNotifications'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));
    const unsubCoaches = onSnapshot(collection(db, 'coaches'), (snapshot) => {
      const data: Coach[] = [];
      snapshot.forEach(doc => data.push({ ...doc.data(), id: doc.id } as Coach));
      if (data.length > 0) setCoaches(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'coaches'));

    return () => {
      unsubStudents();
      unsubSchedule();
      unsubNotifications();
      unsubCoaches();
      unsubSettings();
    };
  }, [setStudents, setSchedule, setNotifications, setCoaches, setSettings]);
}

export const syncStudentToFirebase = async (student: Student) => {
  try {
    const { id, ...data } = student;
    await setDoc(doc(db, 'students', id), { ...data, updatedAt: serverTimestamp(), createdAt: (data as any).createdAt || serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `students/${student.id}`);
  }
};

export const deleteStudentFromFirebase = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${id}`);
  }
};

export const syncSessionToFirebase = async (session: PracticeSession) => {
  try {
    const { id, ...data } = session;
    await setDoc(doc(db, 'practiceSessions', id), { ...data, updatedAt: serverTimestamp(), createdAt: (data as any).createdAt || serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `practiceSessions/${session.id}`);
  }
};

export const syncCoachToFirebase = async (coach: Coach) => {
  try {
    const { id, ...data } = coach;
    await setDoc(doc(db, 'coaches', id), { ...data }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `coaches/${coach.id}`);
  }
};

export const deleteCoachFromFirebase = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'coaches', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `coaches/${id}`);
  }
};

export const syncNotificationToFirebase = async (notif: ParentNotification) => {
  try {
    const { id, ...data } = notif;
    await setDoc(doc(db, 'parentNotifications', id), { ...data, createdAt: (data as any).createdAt || serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `parentNotifications/${notif.id}`);
  }
};

export const syncSettingsToFirebase = async (settings: any) => {
  try {
    const jsonString = JSON.stringify(settings);
    if (jsonString.length > 900000) {
      console.warn("Settings document is too large to sync to Firebase (exceeds 1MB). Syncing safe version.");
      const safeSettings = { ...settings };
      if (safeSettings.bannerUrl && safeSettings.bannerUrl.length > 300000) safeSettings.bannerUrl = '';
      if (safeSettings.logoUrl && safeSettings.logoUrl.length > 300000) safeSettings.logoUrl = '';
      await setDoc(doc(db, 'settings', 'global'), safeSettings, { merge: true });
      return;
    }
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/global`);
  }
};
