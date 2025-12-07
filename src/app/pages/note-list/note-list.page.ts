import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class NoteListPage implements OnInit {
  notes: Note[] = [];

  constructor(
    private noteService: NoteService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.noteService.getNotes().subscribe(notes => {
      this.notes = notes;
    });
  }

  async createNote() {
    const note = await this.noteService.createNote();
    this.router.navigate(['/note-editor', note.id]);
  }

  openNote(note: Note) {
    this.router.navigate(['/note-editor', note.id]);
  }

  async deleteNote(note: Note, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Видалити нотатку?',
      message: `"${note.title}" буде видалено назавжди.`,
      buttons: [
        { text: 'Скасувати', role: 'cancel' },
        {
          text: 'Видалити',
          role: 'destructive',
          handler: async () => {
            await this.noteService.deleteNote(note.id);
            this.showToast('Нотатку видалено');
          }
        }
      ]
    });

    await alert.present();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'щойно';
    if (hours < 24) return `${hours} год тому`;

    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getPreview(note: Note): string {
    const text = note.content.trim();
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
