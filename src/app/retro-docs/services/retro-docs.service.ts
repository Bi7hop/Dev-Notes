import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Entry {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RetroDocsService {
  private entriesSubject = new BehaviorSubject<Entry[]>([]);
  entries$ = this.entriesSubject.asObservable();
  
  constructor(private firestore: Firestore) {
    this.initializeListener();
  }

  private initializeListener() {
    const entriesRef = collection(this.firestore, 'entries');
    onSnapshot(entriesRef, (snapshot) => {
      const entries = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Entry));
      this.entriesSubject.next(entries);
    });
  }

  getEntries(): Observable<Entry[]> {
    return this.entries$;
  }

  async addEntry(entry: Omit<Entry, 'id'>) {
    const entriesRef = collection(this.firestore, 'entries');
    return addDoc(entriesRef, {
      ...entry,
      created: new Date()
    });
  }

  async deleteEntry(id: string) {
    const entryRef = doc(this.firestore, 'entries', id);
    return deleteDoc(entryRef);
  }

  async updateEntry(id: string, updatedEntry: Partial<Entry>) {
    const entryRef = doc(this.firestore, 'entries', id);
    return updateDoc(entryRef, {
      ...updatedEntry
    });
  }
}
