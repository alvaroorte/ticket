import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html'
})
export class StepperComponent {

  @Input({required: true}) steps!: string[];
  @Input() indexCurrent: number = 1;
  @Output() changeStep = new EventEmitter<any>();

  setStep( index: number ) {
    this.changeStep.emit(index);
  }
}
