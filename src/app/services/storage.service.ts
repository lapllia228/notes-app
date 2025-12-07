import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'notes-app_';

  constructor() {}

  async save(key: string, data: any): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error('Помилка збереження в localStorage:', error);
      throw error;
    }
  }

  async load(key: string): Promise<any> {
    try {
      const serialized = localStorage.getItem(this.PREFIX + key);
      if (!serialized) {
        return null;
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Помилка завантаження з localStorage:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error('Помилка видалення з localStorage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Помилка очищення localStorage:', error);
      throw error;
    }
  }
}
