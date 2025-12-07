import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notes$ = new BehaviorSubject<Note[]>([]);

  constructor(private storage: StorageService) {
    this.loadNotes();
  }

  getNotes(): Observable<Note[]> {
    return this.notes$.asObservable();
  }

  async createNote(): Promise<Note> {
    const note: Note = {
      id: this.generateId(),
      title: 'Нова нотатка',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const notes = [note, ...this.notes$.value];
    this.notes$.next(notes);
    await this.saveNotes();
    return note;
  }

  async updateNote(id: string, data: Partial<Note>): Promise<void> {
    const notes = this.notes$.value;
    const index = notes.findIndex(n => n.id === id);

    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...data,
        updatedAt: new Date()
      };
      this.notes$.next([...notes]);
      await this.saveNotes();
    }
  }

  async deleteNote(id: string): Promise<void> {
    const notes = this.notes$.value.filter(n => n.id !== id);
    this.notes$.next(notes);
    await this.saveNotes();
  }

  getNoteById(id: string): Note | undefined {
    return this.notes$.value.find(n => n.id === id);
  }

  private async loadNotes(): Promise<void> {
    const data = await this.storage.load('notes');
    if (data && Array.isArray(data)) {
      const notes = data.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt)
      }));
      this.notes$.next(notes);
    }
  }

  private async saveNotes(): Promise<void> {
    await this.storage.save('notes', this.notes$.value);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
