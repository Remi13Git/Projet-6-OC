import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {
  @Input() text: string = 'Bouton'; 
  @Input() route?: string; // Route optionnelle pour la navigation
  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() disabled: boolean = false; // Ajout du disabled

  @Output() clicked = new EventEmitter<void>(); // Événement pour le clic

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
