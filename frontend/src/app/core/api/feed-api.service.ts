import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Post, CreatePostRequest, UpdatePostRequest } from '../models/post.model';
import { PaginatedResponse, PaginationParams } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class FeedApiService {
  private http = inject(HttpClient);

  getPosts(params: PaginationParams): Observable<PaginatedResponse<Post>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<Post>>(API_ENDPOINTS.FEED.BASE, { params: httpParams });
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(API_ENDPOINTS.FEED.BY_ID(id));
  }

  createPost(payload: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(API_ENDPOINTS.FEED.BASE, payload);
  }

  updatePost(id: string, payload: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(API_ENDPOINTS.FEED.BY_ID(id), payload);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.FEED.BY_ID(id));
  }
}
