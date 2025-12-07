import { Component } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem, IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  arrowBack,
  checkmark,
  trash,
  documentTextOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList]
})
export class AppComponent {
  constructor() {
    addIcons({
      'add': add,
      'arrow-back': arrowBack,
      'checkmark': checkmark,
      'trash': trash,
      'document-text-outline': documentTextOutline
    });
  }
}
