import { Component } from '@angular/core';
import { BlogPost, BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-posts',
  standalone: false,
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  posts: BlogPost[] = [];
  isLoading = false;
 isExpanded: { [key: number]: boolean } = {};
  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPosts();
  }
  
  toggleReadMore(postId: number) {
    this.isExpanded[postId] = !this.isExpanded[postId];
  }
loadPosts(): void {
  this.isLoading = true;
  this.blogService.getPosts().subscribe({
    next: (data) => {
      this.posts = data.map(post => ({
        ...post,
        // convert base64 field into proper image src
        image: post.imageBase64 ? 'data:image/jpeg;base64,' + post.imageBase64 : 'assets/no-image.png',
        date: new Date(post.createdAt).toDateString(),
        category: post.category || 'General',
        readTime: post.readTime || '5 min',
        authorName: post.authorName || 'Unknown',
        // ✅ add property to handle "Lire la suite"
        isExpanded: false
      }));
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading posts:', err);
      this.isLoading = false;
    }
  });
}

}
