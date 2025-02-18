import { Component, Input, inject } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { ParametersService } from '@parameter/services/parameters.service';
import { CategoriesService } from '@category/services/categories.service';
import { EnterprisesService } from '@enterprise/services/enterprises.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { TeamsService } from 'src/app/modules/team/services/teams.service';
import { TeamMemberService } from '@team-members/services/teamMembers.service';
import { EnterpriseCategoryDetailService } from '@enterpriseCategoryDetail/services/enterpriseCategoryDetail.service';
import { EnterpriseCategoriesService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { SupervisorCategoriesService } from 'src/app/modules/supervisor-categories/services/supervisor-categories.service';
import { SupervisorService } from 'src/app/modules/supervisor/services/supervisor.service';

@Component({
  selector: 'app-toolbar-common',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PrimeComponentsModule ],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  @Input() serviceGeneric: ParametersService | CategoriesService | EnterprisesService | TicketsService | TeamsService | TeamMemberService | EnterpriseCategoriesService | EnterpriseCategoryDetailService | SupervisorService | SupervisorCategoriesService | null = null;
  @Input() object: any | null = null;
  @Input() showCreate: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() tooltipCreate: string = 'Crear';
  @Input() tooltipEdit: string = 'Editar';
  @Input() tooltipDelete: string = 'Eliminar';

  tableComponent: any;
  formComponent: any;
  modalDeleteComponent: any;

  private helpersService = inject(HelpersService);

  ngOnInit() {
    if ( this.serviceGeneric ) {
      this.serviceGeneric.eventToolbarComponent.emit(this);

      this.serviceGeneric.eventFormComponent.subscribe((formComponent) => {
        this.formComponent = formComponent;
      });

      this.serviceGeneric.eventModalDeleteComponent.subscribe((modalDeleteComponent) => {
        this.modalDeleteComponent = modalDeleteComponent;
      });

      this.serviceGeneric.eventTableComponent.subscribe((tableComponent) => {
        this.tableComponent = tableComponent;
      });
    }
  }

  create() {
    this.formComponent.openCreate();
  }

  edit() {
    if ( this.object && this.object.id ) {
      this.formComponent.openEdit(this.object.id as number);
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Fila`, 3000);
    }
  }

  deleteRow() {
    if ( this.object && this.object.id ) {
      this.modalDeleteComponent.openConfirm();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Fila`, 3000);
    }
  }

  reload() {
    this.tableComponent.reload();
  }
}
