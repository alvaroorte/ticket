import { Component, inject, OnChanges, OnInit, signal, SimpleChanges, input } from "@angular/core";
import { RoleService } from "../../services/role.service";
import { HelpersService } from "@core/services/helpers.service";
import { RoleWithPermissions } from "@core/models/Role";
import { LABELS } from "@core/constants/labels";
import { Permission } from "@core/models/Permission";
import { TableDoubleComponent } from "../../../../shared/components/table-double/table-double.component";
import { FieldsetModule } from "primeng/fieldset";

@Component({
    selector: 'app-assign-permissions',
    templateUrl: './assign-permissions.component.html',
    imports: [TableDoubleComponent, FieldsetModule]
})

export class assignPermissionsComponent implements OnInit, OnChanges {

  readonly roleId = input.required<number>();

  private roleService = inject(RoleService);
  private helpersService = inject(HelpersService);
  
  public readonly labels = LABELS;
  public sourceProducts = signal<Permission[]>([]);
  public targetProducts = signal<Permission[]>([]);

  ngOnInit(): void {
    this.roleService.eventReloadPermissionByRol.subscribe(() => this.getPermissionAssignedByRole());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roleId']) {
      this.getPermissionAssignedByRole();
    }
  }

  public getPermissionAssignedByRole() {
    const roleId = this.roleId();
    if (roleId) {
      this.roleService.permissionAssignedByRole(roleId).subscribe({
        next: (res) => { 
          this.targetProducts.set(res.assigned);
          this.sourceProducts.set(res.unassigned);          
        }
      });
    } else {
      this.cleanPermissions()
    }
  }

  private cleanPermissions() {
    this.targetProducts.set([]);
    this.sourceProducts.set([]);
  }

  public add(permissions: Permission[]) {
    this.createList(this.targetProducts().length == 0? permissions: this.targetProducts());
  }

  public allAdd() {
    this.createList(this.targetProducts());
  }

  private createList(permissions: Permission[]) {
    const body: RoleWithPermissions = { 
      roleId : this.roleId(),
      permissionsIds : permissions.map( permission => permission.id! )
    };
    this.roleService.addPermissions(body).subscribe({
      next: () => {  
        this.helpersService.messageNotification("success", "Correcto", `Se asignó la(s) categoría(s) correctamente.`, 2000);
        this.getPermissionAssignedByRole();
      },
      error: () => {
        this.getPermissionAssignedByRole();
      }
    });
  }
  
  public remove() {
    this.createList(this.targetProducts())
  }
  
  public allRemove() {
    this.createList(this.targetProducts())
  }
  
}
