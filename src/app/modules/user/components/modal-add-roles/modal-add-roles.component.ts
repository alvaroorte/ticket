import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { RoleService } from 'src/app/modules/role/services/role.service';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { User } from '@core/models/user';
import { Role } from '@core/models/Role';
import { UserService } from '../../services/user.service';
import { areObjectListsEqual } from '@core/utils/common-functions';
import { IUpdateRolesToUSer } from '@core/interfaces/user.interface';
import { Severity } from '@core/enums/severity';
import { LoginService } from '@core/services/login.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
    selector: 'app-modal-add-roles',
    templateUrl: './modal-add-roles.component.html',
    imports: [PrimeModules, FormsModule]
})
export class ModalAddRolesComponent implements OnInit, OnDestroy {

  private helpersService = inject(HelpersService);  
  private rolesService = inject(RoleService); 
  private userService = inject(UserService);
  private loginService = inject(LoginService);

  public labels = LABELS;
  public messages = MESSAGES;
  public dialog = false;
  public user: User;
  public roles: Role[] = [];
  public selectedRoleIds: number[] = [];
  public selectedRoles: Role[] = [];
  public thereWereChanges = false;
  private initStateOfRoles: number[] = [];
  private tableComponent = this.userService.eventTableComponent;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.userService.eventOpenModalAddRoles.subscribe((userSelected) => {
        this.user = userSelected;
        this.openModal();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openModal() {
    this.selectedRoleIds = this.user.roles.map(role => role.id);
    this.initStateOfRoles = [...this.selectedRoleIds];
    this.thereWereChanges = false;
    this.loadRoles();
    this.dialog = true;
  }

  private loadRoles() {
    this.rolesService.getAll().subscribe({
      next: (resp) => {
        this.roles = resp;
        this.setRolesList();
      },
    });
  }

  private reset() {
    this.selectedRoleIds = [];
    this.setRolesList();
    this.roles = [];
  }

  private setRolesList() {
    this.selectedRoles = this.selectedRoleIds.map(roleId => {
      return this.roles.find(r => r.id === roleId)
    });
  }

  public removeRole(id: number) {
    this.selectedRoleIds = [...this.selectedRoleIds.filter(rolId => rolId !== id)];
    this.setRolesList();
    this.thereWereChanges = !areObjectListsEqual(this.initStateOfRoles, this.selectedRoleIds);
  }

  public onRolesChange() {
    this.setRolesList();
    this.thereWereChanges = !areObjectListsEqual(this.initStateOfRoles, this.selectedRoleIds);
  }

  public hideDialog() {
    this.dialog = false;
    this.reset();
  }

  public saveRoles() {
    const body: IUpdateRolesToUSer = {
      userAppId: this.user.id,
      rolesIds: this.selectedRoleIds
    }
    this.userService.updateRolesToUSer(body).subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", "Actualizado con exito.");
        this.tableComponent().reload();
        if (this.loginService.userId() === this.user.id) this.loginService.getRolesUserLogued();
        this.hideDialog();
      },
    });
  }
}
