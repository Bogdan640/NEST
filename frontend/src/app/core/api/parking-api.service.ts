import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  ParkingAnnouncement,
  ParkingSlot,
  CreateAnnouncementRequest,
  CreateParkingSlotRequest,
} from '../models/parking.model';
import { PaginatedResponse, PaginationParams } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ParkingApiService {
  private http = inject(HttpClient);

  getAnnouncements(params: PaginationParams): Observable<PaginatedResponse<ParkingAnnouncement>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<ParkingAnnouncement>>(API_ENDPOINTS.PARKING.BASE, { params: httpParams });
  }

  getAnnouncementById(id: string): Observable<ParkingAnnouncement> {
    return this.http.get<ParkingAnnouncement>(API_ENDPOINTS.PARKING.BY_ID(id));
  }

  createAnnouncement(payload: CreateAnnouncementRequest): Observable<ParkingAnnouncement> {
    return this.http.post<ParkingAnnouncement>(API_ENDPOINTS.PARKING.BASE, payload);
  }

  deleteAnnouncement(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.PARKING.BY_ID(id));
  }

  applyToAnnouncement(id: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.PARKING.APPLY(id), {});
  }

  approveApplication(applicationId: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.PARKING.APPROVE_APPLICATION(applicationId), {});
  }

  getSlots(): Observable<ParkingSlot[]> {
    return this.http.get<ParkingSlot[]>(API_ENDPOINTS.PARKING.SLOTS);
  }

  createSlot(payload: CreateParkingSlotRequest): Observable<ParkingSlot> {
    return this.http.post<ParkingSlot>(API_ENDPOINTS.PARKING.SLOTS, payload);
  }
}
