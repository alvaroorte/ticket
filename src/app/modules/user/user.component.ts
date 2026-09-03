import { Component, inject, signal } from '@angular/core';

import { LABELS } from '@core/constants/labels';
import { User } from '@core/models/user';
import { UserService } from './services/user.service';
import { TOOLTIPS } from '@core/constants/tooltips';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { MESSAGES } from '@core/constants/messages';
import { TableOnDemnadComponent } from '@shared/components/table-on-demand/table-on-demand.component';
import { HttpParams } from '@angular/common/http';
import { ModalAddRolesComponent } from './components/modal-add-roles/modal-add-roles.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';

@Component({
    selector: 'app-user',
    imports: [TableOnDemnadComponent, ModalAddRolesComponent, PrimeModules],
    templateUrl: './user.component.html',
    styles: []
})
export class UserComponent {

  public userService = inject(UserService);
  public helpersService = inject(HelpersService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public readonly tootips = TOOLTIPS;
  public totalElements = signal<number>(0);
  public users = signal<User[]>([]);
  public columns = TableColumnDefinitions.getUserColumnsDefinition();
  private userSelected: User;

  public setUser( userSelected: User  ) {
    this.userSelected = userSelected;
  }

  public openModalRoles() {
    if (this.userSelected?.id) {
      this.userService.eventOpenModalAddRoles.emit(this.userSelected);
    } else {
      this.helpersService.messageNotification(Severity.info, this.labels.please, this.messages.selectARow);
    }
  }

  public loadUsers(params: HttpParams) {
    this.userService.getPageable(params).subscribe({
      next: (res) => {
        this.users.set(res.content.map((user => {
          return {
            ...user,
            rolesString: user.roles.map(r => r.name).join(', ')
          }
        })));
        this.totalElements.set(res.totalElements);
      }, error: () => {
        this.users.set([]);
      }
    });
  }

  public onTableSelfEmision(table: TableOnDemnadComponent<User>) {
    this.userService.eventTableComponent.set(table);
  }

}
