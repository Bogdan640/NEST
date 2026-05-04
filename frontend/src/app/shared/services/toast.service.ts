import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration: number = 5000) {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.update(t => [...t, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
