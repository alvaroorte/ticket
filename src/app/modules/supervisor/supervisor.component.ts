import { Component, inject, signal } from '@angular/core';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { SupervisorService } from './services/supervisor.service';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { SupervisorModule } from './supervisor.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { Supervisor } from '@core/models/Supervisor';
import { SupervisorCategoriesComponent } from '@supervisorCategory/supervisor-categories.component';

@Component({
  selector: 'app-supervisor',
  standalone: true,
  imports: [SupervisorModule, ModaldeleteComponent, ToolbarComponent, SupervisorCategoriesComponent],
  templateUrl: './supervisor.component.html',
  providers: [ HelpersService ]
})
export class SupervisorComponent {

  supervisorService = inject(SupervisorService);

  object = signal(new Supervisor);
  enterpriseCategory = signal(new EnterpriseCategory);

  ngOnInit(): void {
    this.object.set(new Supervisor);
  }

  setObject( object: Supervisor  ) {
    this.object.set(object);
  }
}

