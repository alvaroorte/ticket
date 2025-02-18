import { Component, EventEmitter, Input, Output, Signal, inject, signal } from '@angular/core';
import { Supervisor } from '@core/models/Supervisor';
import { SupervisorCategory } from '@core/models/SupervisorCategory';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { SupervisorCategoriesService } from './services/supervisor-categories.service';
import { SupervisorCategoriesModule } from './supervisor-categories.module';

@Component({
  selector: 'app-supervisor-categories',
  standalone: true,
  imports: [ SupervisorCategoriesModule, ToolbarComponent],
  templateUrl: './supervisor-categories.component.html'
})
export class SupervisorCategoriesComponent {
  @Input() supervisor!: Signal<Supervisor>;
  @Output() changeSupervisorCategory = new EventEmitter<SupervisorCategory>();

  supervisorCategory = signal<SupervisorCategory>(new SupervisorCategory);

  supervisorCategoryService = inject(SupervisorCategoriesService);
}
