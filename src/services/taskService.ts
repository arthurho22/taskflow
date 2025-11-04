import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    updateDoc,
    getFirestore,
  } from 'firebase/firestore'
  import app from '@/lib/firebase'
  import { Task } from '@/types/task'
  
  const db = getFirestore(app)
  const tasksRef = collection(db, 'tasks')
  
  export const createTask = async (task: Task) => {
    await addDoc(tasksRef, task)
  }
  
  export const listenTasksByUser = (userId: string, callback: (tasks: Task[]) => void) => {
    const q = query(tasksRef, where('userId', '==', userId))
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      callback(tasks)
    })
  }
  
  export const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id))
  }
  
  export const updateTask = async (id: string, data: Partial<Task>) => {
    await updateDoc(doc(db, 'tasks', id), data)
  }
  