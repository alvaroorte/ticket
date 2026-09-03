import { Component, OnDestroy, OnInit, inject, input, output, signal } from '@angular/core';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { CredencialService } from '@core/services/credencial.service';
import { ICredentialUser } from '@core/interfaces/user.interface';
import { PLACEHOLDERS } from '@core/constants/placeholder';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { COMMON } from '@core/constants/common';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-select-generic-users',
    imports: [ReactiveFormsModule, PrimeModules, FormsModule, NgClass],
    templateUrl: './select-generic-users.component.html'
})
export class SelectGenericUsersComponent implements OnInit, OnDestroy {

  readonly fullUser = input<boolean>(false);
  readonly isRequired = input<boolean>(true);
  readonly userId = input<number>();
  readonly userNameForFilter = input<string>();
  readonly label = input<string>('Usuario');
  readonly selectedUser = output<number>();
  readonly selectedFullUser = output<ICredentialUser>();

  private credencialService = inject(CredencialService);
  
  public readonly placeholders = PLACEHOLDERS;
  public users = signal<ICredentialUser[]>([]);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getUsers();
    if (this.userId()) {
      this.tryGetUsers(this.userNameForFilter());
      this.setUser(this.userId());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUsers() {
    this.searchSubject.pipe(
      debounceTime(COMMON.inputDebounceDelay),
      takeUntil(this.destroy$)
    ).subscribe((some) => {
      this.credencialService.allUsers(some).subscribe({
        next: (res) => {
          this.users.set(res);
        }
      });
    });
  }
  
  public tryGetUsers(some: string) {
    if (some?.length >= 3) {
      this.searchSubject.next(some);
    } else {
      this.users.set([]);
    }
  }

  public setUser(userId: number) {
    if (this.fullUser()) {
      const userFull: ICredentialUser = this.users().find((user) => user.credentialId == userId);
      this.selectedFullUser.emit(userFull);
    } else {
      this.selectedUser.emit(userId);
    }
  }
}
