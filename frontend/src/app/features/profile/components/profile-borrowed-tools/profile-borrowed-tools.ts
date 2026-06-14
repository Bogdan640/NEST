import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-borrowed-tools',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile-borrowed-tools.html',
  styleUrl: './profile-borrowed-tools.scss'
})
export class ProfileBorrowedTools {
  borrowedTools = input.required<any[]>();
}
