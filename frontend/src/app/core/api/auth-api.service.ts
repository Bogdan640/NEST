import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  JoinBlockRequest,
  JoinBlockResponse,
  PermissionsResponse,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  }

  joinBlock(payload: JoinBlockRequest): Observable<JoinBlockResponse> {
    return this.http.post<JoinBlockResponse>(API_ENDPOINTS.AUTH.JOIN_BLOCK, payload);
  }

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(API_ENDPOINTS.AUTH.PERMISSIONS);
  }
}
