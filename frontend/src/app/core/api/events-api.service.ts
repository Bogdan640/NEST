import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { NestEvent, CreateEventRequest, UpdateEventRequest } from '../models/event.model';
import { PaginatedResponse, PaginationParams } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private http = inject(HttpClient);

  getEvents(params: PaginationParams): Observable<PaginatedResponse<NestEvent>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<NestEvent>>(API_ENDPOINTS.EVENTS.BASE, { params: httpParams });
  }

  getEventById(id: string): Observable<NestEvent> {
    return this.http.get<NestEvent>(API_ENDPOINTS.EVENTS.BY_ID(id));
  }

  createEvent(payload: CreateEventRequest): Observable<NestEvent> {
    return this.http.post<NestEvent>(API_ENDPOINTS.EVENTS.BASE, payload);
  }

  updateEvent(id: string, payload: UpdateEventRequest): Observable<NestEvent> {
    return this.http.put<NestEvent>(API_ENDPOINTS.EVENTS.BY_ID(id), payload);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.EVENTS.BY_ID(id));
  }

  joinEvent(id: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.EVENTS.JOIN(id), {});
  }

  leaveEvent(id: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.EVENTS.LEAVE(id), {});
  }
}
