import { inject, signal } from "@angular/core";
import { DataCommon } from "@core/models/FieldsCommons";
import { Role, RoleWithPermissions } from "src/app/core/models/Role";
import { HelpersService } from "src/app/core/services/helpers.service";
import { RoleService } from "../services/role.service";

export class TableDoubleHelper {

  roleService = inject(RoleService);
  helpersService = inject(HelpersService);
  
  selectedRole = signal<Role>( new Role );
  sourceProducts = signal<DataCommon[]>([]);
  targetProducts = signal<DataCommon[]>([]);
  
  setSelectedRole( role: Role) {
    this.selectedRole.set( role );
    this.getPermissionAssignedByRole();
  }

  getPermissionAssignedByRole() {
    if ( this.selectedRole() && this.selectedRole().id ) {
      this.roleService.permissionAssignedByRole(this.selectedRole().id as number).subscribe({
        next: (res) => { 
          this.targetProducts.set(res.filter( dato => dato.description == 'asignado' ));
          this.sourceProducts.set(res.filter( dato => dato.description == 'disponible' ));          
        },
        error: (err) => { 
          console.log(err);
        }
      });
    } else {
      this.cleanPermissions()
    }
  }

  cleanPermissions() {
    this.targetProducts.set([]);
    this.sourceProducts.set([]);
  }

  add(permission:DataCommon[]){
    this.createList(permission)
  }

  allAdd(permission:DataCommon[]){
    this.createList(permission)
  }

  createList(permission:DataCommon[]) {
    let body: RoleWithPermissions = { 
      roleId : this.selectedRole().id!,
      permissionsIds : permission.map( per => per.id! )
    };
    this.roleService.createList(body).subscribe({
      next: () => {  
        this.helpersService.messageNotification("success", "Correcto", `Se asignó la(s) categoría(s) correctamente.`, 2000);
        this.getPermissionAssignedByRole();
      },
      error: (err) => { 
        console.log(err);
        this.getPermissionAssignedByRole();
      }
    });
  }
  
  remove(permission:DataCommon[]){
    this.deleteList(permission)
  }
  
  allRemove(permission:DataCommon[]){
    this.deleteList(permission)
  }

  deleteList(permission:DataCommon[]) {
    let body: RoleWithPermissions = { 
      roleId : this.selectedRole().id!,
      permissionsIds : permission.map( per => per.id! )
    };
    this.roleService.deleteList(body).subscribe({
      next: () => {  
        this.helpersService.messageNotification("warn", "Correcto", `Se quitó la(s) categoría(s) correctamente.`, 2000);
        this.getPermissionAssignedByRole();
      },
      error: (err) => { 
        console.log(err);
        this.getPermissionAssignedByRole();
      }
    });
  }
}