import { Component, inject, signal } from '@angular/core';
import { Parameter } from 'src/app/core/models/Parameter';
import { ParametersService } from './services/parameters.service';
import { HelpersService } from 'src/app/core/services/helpers.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  providers: [ HelpersService ]
})
export class ParametersComponent {

  parametersService = inject(ParametersService);
  object!: Parameter;

  parameters = signal<Parameter[]>([]);

  ngOnInit(): void {
    this.object = new Parameter;
  }

  setObject( object: Parameter ) {
    this.object = object
  }
}
