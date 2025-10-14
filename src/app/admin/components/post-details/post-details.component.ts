import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BlogPost, BlogService } from '../../../services/blog.service';
import { CommentService, Comment } from '../../../services/comment.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';


@Component({
  selector: 'app-post-details',
  standalone: false,
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit, AfterViewInit {
  post!: BlogPost;
  comments: Comment[] = [];
  newComment = '';
  charCount = 0;

  // Derived presentation fields
  coverIsImage = true;
  coverImageUrl: string | null = null;
  coverVideoUrl: string | null = null;
  headerBgStyle: { [k: string]: string } = {};
  readingTime = '5 min';
    headerBgSafe!: SafeStyle | null;


  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private commentService: CommentService,
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: any,
    private sanitizer: DomSanitizer       // ✅ ajout

  ) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(postId);
    this.loadComments(postId);
  }


   private makeAbsolute(url?: string | null): string | null {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const base = 'http://localhost:8081'; // adapte ton port backend
    return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
  }

  ngAfterViewInit() {
    this.setupProgressBar();
  }

  // ===== UI enhancers =====
  setupProgressBar() {
    if (!isPlatformBrowser(this.platformId)) return;
    const onScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const max = Math.max(docHeight - winHeight, 1);
      const pct = Math.min((scrollTop / max) * 100, 100);
      const bar = document.getElementById('progressBar');
      if (bar) bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // initial
    onScroll();
  }

  updateCount() {
    this.charCount = this.newComment?.length || 0;
  }

  // ===== Data =====
   loadPost(id: number): void {
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        const absUrl = this.makeAbsolute(post.mediaUrl);
        const type = (post.mediaContentType || '').toLowerCase();
        this.coverIsImage = type.startsWith('image/');
        this.coverImageUrl = this.coverIsImage ? absUrl : null;
        this.coverVideoUrl = !this.coverIsImage ? absUrl : null;

        // ✅ On crée un SafeStyle à partir de l’URL absolue
        this.headerBgSafe = this.coverIsImage && this.coverImageUrl
          ? this.sanitizer.bypassSecurityTrustStyle(`url('${this.coverImageUrl}')`)
          : null;

        // Calcul du temps de lecture + métadonnées
        const words = (post.description || '').split(/\s+/).length;
        const minutes = Math.max(1, Math.round(words / 200));
        const createdDate = post.createdAt ? new Date(post.createdAt) : new Date();
        const prettyDate = createdDate.toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        this.post = {
          ...post,
          date: prettyDate,
          readTime: `${minutes} min`,
          authorName: post.authorName || 'Admin',
          category: (post as any).category || 'General'
        } as BlogPost;
      }
    });
  }

  loadComments(postId: number) {
    this.comments = [];
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        comments.forEach((comment) => {
          const authorId = comment.author?.id;
          if (authorId) {
            this.customerService.getProfile(authorId).subscribe({
              next: (profile) => {
                comment.author = {
                  id: profile.id,
                  username: profile.nom,
                  photo: profile.img
                    ? (profile.img.startsWith('data:image') ? profile.img : `data:image/jpeg;base64,${profile.img}`)
                    : 'assets/default-user.png'
                };
              },
              error: () => {
                comment.author = { id: authorId, username: comment.author.username, photo: 'assets/default-user.png' };
              }
            });
          } else {
            comment.author = { id: 0, username: 'Anonymous', photo: 'assets/default-user.png' };
          }
        });
        this.comments = comments;
      },
      error: () => {}
    });
  }

  // ===== Comments =====
  submitComment() {
    if (!this.newComment.trim() || !this.post?.id) return;
    const postId = this.post.id!;
    const content = this.newComment.trim();
    const _token = UserStorageService.getToken();
    const _user = UserStorageService.getUser();

    this.commentService.addComment(postId, content).subscribe({
      next: (savedComment) => {
        this.comments.unshift(savedComment);
        this.newComment = '';
        this.updateCount();
      },
      error: () => {}
    });
  }

  likeComment(comment: Comment) {
    comment.isLiked = !comment.isLiked;
    comment.likeCount = comment.isLiked ? (comment.likeCount || 0) + 1 : Math.max((comment.likeCount || 1) - 1, 0);
  }
}
