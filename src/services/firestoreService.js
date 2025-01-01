// src/services/firestoreService.js
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc,updateDoc, query, where } from 'firebase/firestore';

export async function savePMR(userId, pmrData) {
  const pmrCollection = collection(db, 'users', userId, 'pmrEntries');
  await addDoc(pmrCollection, pmrData);
}

export async function fetchPMR(userId) {
  const pmrCollection = collection(db, 'users', userId, 'pmrEntries');
  const snapshot = await getDocs(pmrCollection);
  const results = [];
  snapshot.forEach(doc => {
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
}

export async function deletePMR(userId, pmrId) {
    const pmrDoc = doc(db, "users", userId, "pmrEntries", pmrId);
    await deleteDoc(pmrDoc);
}

export async function updatePMR(userId, pmrId, updatedData) {
    const pmrDoc = doc(db, "users", userId, "pmrEntries", pmrId);
    await updateDoc(pmrDoc, updatedData);
}