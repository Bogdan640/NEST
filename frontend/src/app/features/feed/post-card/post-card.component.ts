import { Component, input, output } from '@angular/core';
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
  readonly post = input.required<Post>();
  readonly canDelete = input(false);

  readonly deleteClicked = output<string>();

  onDelete(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deleteClicked.emit(this.post().id);
    }
  }
}
