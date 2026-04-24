import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User, UpdateProfileRequest, UpdatePreferencesRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);

  getMe(): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.USER.ME);
  }

  updateMe(payload: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(API_ENDPOINTS.USER.ME, payload);
  }

  updatePreferences(payload: UpdatePreferencesRequest): Observable<User> {
    return this.http.put<User>(API_ENDPOINTS.USER.PREFERENCES, payload);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.USER.BY_ID(id));
  }
}
