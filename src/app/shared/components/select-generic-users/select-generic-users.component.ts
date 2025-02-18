import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { DataCommon } from '@core/models/FieldsCommons';
import { CredencialService } from '@core/services/credencial';
import { HelpersService } from '@core/services/helpers.service';

@Component({
  selector: 'app-select-generic-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeComponentsModule, FormsModule ],
  templateUrl: './select-generic-users.component.html'
})
export class SelectGenericUsersComponent implements OnInit {
  @Input() fullUser: Boolean = false;
  @Input() userId: number;
  @Output() selectedUser = new EventEmitter<number>();
  @Output() selectedFullUser = new EventEmitter<DataCommon>();

  private helpersService = inject(HelpersService);

  credencialUser = inject(CredencialService);
  users: DataCommon[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.credencialUser.allUsers().subscribe({
      next: (res) => {
        this.users = res;
        if (this.userId) {
          this.setUser(this.userId);
        }
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message);
      }
    });
  }

  public setUser(user: any) {
    if (this.fullUser) {
      const userFull: DataCommon = this.users.find((x) => x.id == user.value);
      this.selectedFullUser.emit(userFull);
    } else {
      this.selectedUser.emit(this.userId);
    }
  }
}
