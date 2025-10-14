import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogPost {
image: any;
  imageBase64: any;
  id: number;
  title: string;
  description: string;

  // From backend DTO
  mediaUrl: string | null;
  mediaContentType: string | null;
  createdAt: string;
  authorName: string;

  // Frontend-only (optional)
  category?: string;
  date?: string;
  readTime?: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = 'http://localhost:8081/api/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/all`);
  }

  createPost(formData: FormData): Observable<BlogPost> {
    // Must include: title, description, userId, optional media
    return this.http.post<BlogPost>(this.apiUrl, formData);
  }

  getPostById(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${id}`);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
