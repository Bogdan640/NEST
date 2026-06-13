import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animal-logo',
  standalone: true,
  templateUrl: './animal-logo.component.html',
  styleUrl: './animal-logo.component.scss'
})
export class AnimalLogoComponent {
  @Input() animal: 'BIRD' | 'BEAR' | 'FOX' | 'RACCOON' = 'BIRD';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
