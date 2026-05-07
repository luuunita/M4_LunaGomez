import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export type FirestoreTask = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt?: unknown;
};

export async function getTasksByUser(userId: string): Promise<FirestoreTask[]> {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((taskDoc) => ({
    id: taskDoc.id,
    ...(taskDoc.data() as Omit<FirestoreTask, 'id'>),
  }));
}

export async function addTask(input: {
  title: string;
  description: string;
  userId: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'tasks'), {
    title: input.title,
    description: input.description,
    completed: false,
    userId: input.userId,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function toggleTaskStatus(
  taskId: string,
  currentStatus: boolean,
): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);

  await updateDoc(taskRef, {
    completed: !currentStatus,
  });
}

export async function updateTask(
  taskId: string,
  input: { title: string; description: string },
): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);

  await updateDoc(taskRef, {
    title: input.title,
    description: input.description,
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}
