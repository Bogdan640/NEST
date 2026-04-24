import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { JoinRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);

  getPendingUsers(): Observable<JoinRequest[]> {
    return this.http.get<JoinRequest[]>(API_ENDPOINTS.ADMIN.PENDING_USERS);
  }

  approveUser(userId: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.ADMIN.APPROVE_USER(userId), {});
  }

  rejectUser(userId: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.ADMIN.REJECT_USER(userId), {});
  }

  removeUser(userId: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.ADMIN.REMOVE_USER(userId));
  }
}
