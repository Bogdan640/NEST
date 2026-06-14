import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-edit-form.html',
  styleUrl: './profile-edit-form.scss'
})
export class ProfileEditForm {
  profileForm = input.required<FormGroup>();
  exactMemberSince = input.required<string>();
  isSaving = input<boolean>(false);

  cancel = output<void>();
  save = output<void>();

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    this.save.emit();
  }
}
