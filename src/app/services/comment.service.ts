import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { UserStorageService } from './storage/user-storage.service'; 

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    photo?: string; // add photo property
  };
  isLiked?: boolean;
  likeCount?: number;
}
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8081/api/comments';

  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

addComment(postId: number, content: string): Observable<Comment> {
  const body = { postId, content }; // simple flat structure
  return this.http.post<Comment>(this.apiUrl, body);
}

  likeComment(commentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${commentId}/like`, {});
  }
}