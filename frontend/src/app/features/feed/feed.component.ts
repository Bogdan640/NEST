import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FeedFacade } from '../../store/feed/feed.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { PostCardComponent } from './post-card/post-card.component';
import { FeedApiService } from '../../core/api/feed-api.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ReactiveFormsModule, PostCardComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  private fb = inject(FormBuilder);
  private feedFacade = inject(FeedFacade);
  private authFacade = inject(AuthFacade);
  private feedApi = inject(FeedApiService);
  private toastService = inject(ToastService);

  posts = this.feedFacade.posts;
  isLoading = this.feedFacade.isLoading;
  error = this.feedFacade.error;
  
  currentUser = this.authFacade.currentUser;
  
  newPostForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(500)]],
    imageUrl: [''],
  });

  isSubmitting = signal(false);
  remainingPosts = signal(2);
  nextRefreshTime = signal('');

  ngOnInit(): void {
    this.feedApi.getFeedStatus().subscribe({
      next: (status) => {
        this.remainingPosts.set(status.remainingPosts);
        const timeToRefresh = new Date(status.nextRefresh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.nextRefreshTime.set(timeToRefresh);
        if (status.remainingPosts > 0) {
          this.toastService.show(
            `You have ${status.remainingPosts} post(s) left today. Refreshes at ${timeToRefresh}.`,
            'info',
            8000
          );
        } else {
          this.toastService.show(
            `You've used all your posts for today! Refreshes at ${timeToRefresh}.`,
            'error',
            8000
          );
        }
      }
    });
  }

  onSubmit(): void {
    if (this.newPostForm.invalid) return;
    
    this.isSubmitting.set(true);
    const { content, imageUrl } = this.newPostForm.getRawValue();
    
    this.feedFacade.createPost({ content, imageUrl: imageUrl || undefined });
    
    this.remainingPosts.update(v => Math.max(0, v - 1));
    this.newPostForm.reset();
    this.isSubmitting.set(false);
  }

  onDeletePost(id: string): void {
    this.feedFacade.deletePost(id);
  }

  canDelete(authorId: string): boolean {
    return this.authFacade.canManageResource(authorId);
  }
}
