import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-stepper',
    imports: [NgClass],
    templateUrl: './stepper.component.html'
})
export class StepperComponent {

  readonly steps = input.required<string[]>();
  readonly indexCurrent = input<number>(1);
  readonly onChangeStep = output<number>();

  public setStep( index: number ) {
    this.onChangeStep.emit(index);
  }
}
