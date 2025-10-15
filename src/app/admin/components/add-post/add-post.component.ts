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
  paginatedPosts: BlogPost[] = [];

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  totalPosts = 0;

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
  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Seules les images sont acceptées');
      return;
    }

    try {
      // Compress image if larger than 1MB
      if (file.size > 1048576) { // 1MB in bytes
        console.log('Image trop grande, compression en cours...');
        this.file = await this.compressImage(file);
        console.log('Image compressée:', this.file.size, 'bytes');
      } else {
        this.file = file;
      }

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(this.file);
    } catch (error) {
      console.error('Erreur lors de la compression:', error);
      alert('Erreur lors de la compression de l\'image');
    }
  }

  private compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Convert canvas to blob with compression quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/jpeg',
            0.7 // Compression quality (0-1)
          );
        };
        img.onerror = () => reject(new Error('Image load failed'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  }
loadPosts(): void {
    this.isLoading = true;
    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.totalPosts = data.length;
        this.updatePaginatedPosts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des posts:', err);
        this.isLoading = false;
      }
    });
  }

  updatePaginatedPosts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedPosts();
  }
  clearImage(): void {
    this.file = null;
    this.imagePreview = null;
  }

  getImageUrl(post: BlogPost): string {
    if (post.imageBase64) {
      return `data:image/jpeg;base64,${post.imageBase64}`;
    }
    return 'assets/default.jpg';
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
        // Reset form and reload posts
        this.postForm.reset();
        this.clearImage();
        this.loadPosts();
        alert('Article ajouté avec succès!');
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        this.isSubmitting = false;
        alert('Erreur lors de la création de l\'article');
      }
    });
  }
  deletePost(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== id);
          this.totalPosts = this.posts.length;

          // Adjust page if current page is now empty
          const maxPage = Math.ceil(this.totalPosts / this.pageSize) - 1;
          if (this.pageIndex > maxPage && maxPage >= 0) {
            this.pageIndex = maxPage;
          }

          this.updatePaginatedPosts();
        },
        error: (err) => console.error('Erreur lors de la suppression du post:', err)
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
