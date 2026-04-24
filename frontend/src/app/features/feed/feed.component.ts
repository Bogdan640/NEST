import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FeedFacade } from '../../store/feed/feed.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { PostCardComponent } from './post-card/post-card.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ReactiveFormsModule, PostCardComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  private fb = inject(FormBuilder);
  private feedFacade = inject(FeedFacade);
  private authFacade = inject(AuthFacade);

  posts = this.feedFacade.posts;
  isLoading = this.feedFacade.isLoading;
  error = this.feedFacade.error;
  
  currentUser = this.authFacade.currentUser;
  
  newPostForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(500)]],
    imageUrl: [''],
  });

  isSubmitting = signal(false);

  onSubmit(): void {
    if (this.newPostForm.invalid) return;
    
    this.isSubmitting.set(true);
    const { content, imageUrl } = this.newPostForm.getRawValue();
    
    this.feedFacade.createPost({ content, imageUrl: imageUrl || undefined });
    
    this.newPostForm.reset();
    this.isSubmitting.set(false);
  }

  onDeletePost(id: string): void {
    this.feedFacade.deletePost(id);
  }

  canDelete(authorId: string): boolean {
    const user = this.currentUser();
    return !!user && (user.id === authorId || user.role === 'ADMIN');
  }
}
