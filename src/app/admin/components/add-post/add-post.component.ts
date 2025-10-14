import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogPost, BlogService } from '../../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  standalone: false,
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  postForm: FormGroup;
  file: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  posts: BlogPost[] = [];

  categories: string[] = ['Tech', 'Business', 'Lifestyle', 'General'];

  constructor(private fb: FormBuilder, private blogService: BlogService, private router: Router) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    });
  }
  isLoading = false;
ngOnInit() {
  this.loadPosts();   // Must be called
}
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
loadPosts(): void {
    this.isLoading = true;
    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des posts:', err);
        this.isLoading = false;
      }
    });
  }
  clearImage(): void {
    this.file = null;
    this.imagePreview = null;
  }

  addPost(): void {
    if (!this.postForm.valid || !this.file) return;

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('description', this.postForm.value.description);
    formData.append('category', this.postForm.value.category);
    formData.append('userId', '1'); // TODO: replace with logged-in user ID
    formData.append('image', this.file);

    this.blogService.createPost(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/posts']);
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        this.isSubmitting = false;
      }
    });
  }
  deletePost(id: number): void {
  if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
    this.blogService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== id);
      },
      error: (err) => console.error('Erreur lors de la suppression du post:', err)
    });
  }
  this.loadPosts();
}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
