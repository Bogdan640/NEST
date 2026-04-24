import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Resource, CreateResourceRequest, UpdateResourceRequest, ReserveResourceRequest } from '../models/resource.model';
import { PaginatedResponse, PaginationParams } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ShedApiService {
  private http = inject(HttpClient);

  getResources(params: PaginationParams): Observable<PaginatedResponse<Resource>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<Resource>>(API_ENDPOINTS.SHED.BASE, { params: httpParams });
  }

  getResourceById(id: string): Observable<Resource> {
    return this.http.get<Resource>(API_ENDPOINTS.SHED.BY_ID(id));
  }

  createResource(payload: CreateResourceRequest): Observable<Resource> {
    return this.http.post<Resource>(API_ENDPOINTS.SHED.BASE, payload);
  }

  updateResource(id: string, payload: UpdateResourceRequest): Observable<Resource> {
    return this.http.put<Resource>(API_ENDPOINTS.SHED.BY_ID(id), payload);
  }

  deleteResource(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.SHED.BY_ID(id));
  }

  reserveResource(id: string, payload: ReserveResourceRequest): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.SHED.RESERVE(id), payload);
  }

  returnResource(id: string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.SHED.RETURN(id), {});
  }
}
