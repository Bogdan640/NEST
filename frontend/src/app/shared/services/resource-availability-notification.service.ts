import { Injectable, inject, signal, computed } from '@angular/core';
import { ShedApiService } from '../../core/api/shed-api.service';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';

interface WatchedResource {
  id: string;
  name: string;
  intervalId: any;
}

@Injectable({ providedIn: 'root' })
export class ResourceAvailabilityNotificationService {
  private shedApi = inject(ShedApiService);
  private toastService = inject(ToastService);

  private watchedResourcesMap = new Map<string, WatchedResource>();
  
  // Expose a signal of watched IDs so components can reactively check status
  private watchedIds = signal<string[]>([]);
  public watchedResourceIds = computed(() => this.watchedIds());

  watchResource(id: string, name: string): void {
    if (this.watchedResourcesMap.has(id)) {
      return;
    }

    // Request browser notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.toastService.show('Notifications enabled! We will alert you when available.', 'success');
          } else {
            this.toastService.show('Notifications blocked. We will still notify you in-app.', 'info');
          }
        });
      }
    }

    // Start polling every 30 seconds
    const intervalId = setInterval(() => this.checkAvailability(id), 30000);

    this.watchedResourcesMap.set(id, { id, name, intervalId });
    this.watchedIds.update(ids => [...ids, id]);

    this.toastService.show(`Subscribed to availability alerts for "${name}"`, 'success');
    
    // Do an immediate check in case it became available right after subscription
    this.checkAvailability(id);
  }

  unwatchResource(id: string, silent = false): void {
    const watched = this.watchedResourcesMap.get(id);
    if (!watched) return;

    clearInterval(watched.intervalId);
    this.watchedResourcesMap.delete(id);
    this.watchedIds.update(ids => ids.filter(watchedId => watchedId !== id));

    if (!silent) {
      this.toastService.show(`Unsubscribed from alerts for "${watched.name}"`, 'info');
    }
  }

  isWatching(id: string): boolean {
    return this.watchedIds().includes(id);
  }

  private async checkAvailability(id: string): Promise<void> {
    try {
      const resource = await firstValueFrom(this.shedApi.getResourceById(id));
      
      // Determine if available: no reservations with status 'APPROVED'
      const isAvailable = !resource.reservations || !resource.reservations.some(r => r.status === 'APPROVED');
      
      if (isAvailable) {
        this.triggerNotification(resource.id, resource.name);
      }
    } catch (error) {
      console.error(`Failed to poll status for resource ${id}:`, error);
    }
  }

  private triggerNotification(id: string, name: string): void {
    const title = '🛠️ Item Available!';
    const options: NotificationOptions = {
      body: `"${name}" in the Shared Shed is now available to borrow.`,
      icon: '/assets/logo.png', // Fallback icon path if exists
    };

    // 1. Browser Native Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (err) {
        console.error('Failed to trigger desktop notification:', err);
      }
    }

    // 2. In-App Toast Notification
    this.toastService.show(`"${name}" is now available!`, 'success', 8000);

    // Stop polling
    this.unwatchResource(id, true);
  }
}
