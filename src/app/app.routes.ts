import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'note-list',
    pathMatch: 'full',
  },
  {
    path: 'note-list',
    loadComponent: () => import('./pages/note-list/note-list.page').then(m => m.NoteListPage)
  },
  {
    path: 'note-editor/:id',
    loadComponent: () => import('./pages/note-editor/note-editor.page').then(m => m.NoteEditorPage)
  }
];
