import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.page.html',
  styleUrls: ['./note-editor.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class NoteEditorPage implements OnInit, OnDestroy {
  note: Note | null = null;

  private destroy$ = new Subject<void>();
  private contentChange$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const foundNote = this.noteService.getNoteById(id);
      if (foundNote) {
        this.note = { ...foundNote };
      } else {
        this.router.navigate(['/note-list']);
      }
    }

    this.contentChange$
      .pipe(debounceTime(2000), takeUntil(this.destroy$))
      .subscribe(() => this.saveNote());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onContentChange() {
    this.contentChange$.next();
  }

  async saveNote() {
    if (!this.note) return;
    await this.noteService.updateNote(this.note.id, {
      title: this.note.title,
      content: this.note.content
    });
  }

  async saveAndExit() {
    await this.saveNote();
    const toast = await this.toastController.create({
      message: 'Нотатку збережено',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
    this.router.navigate(['/note-list']);
  }

  goBack() {
    this.router.navigate(['/note-list']);
  }
}
