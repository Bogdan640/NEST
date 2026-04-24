import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Input() canDelete = false;

  @Output() deleteClicked = new EventEmitter<string>();

  onDelete(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deleteClicked.emit(this.post.id);
    }
  }
}
