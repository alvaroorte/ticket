import { Component, OnInit, inject, signal, input, output, OnDestroy } from '@angular/core';

import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { CredencialService } from '@core/services/credencial.service';
import { NgClass } from '@angular/common';
import { ICredentialUser } from '@core/interfaces/user.interface';
import { PLACEHOLDERS } from '@core/constants/placeholder';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { COMMON } from '@core/constants/common';

@Component({
    selector: 'app-multi-select-generic-users',
    imports: [ReactiveFormsModule, PrimeModules, FormsModule, NgClass],
    templateUrl: './multi-select-generic-users.component.html'
})
export class MultiSelectGenericUsersComponent implements OnInit, OnDestroy {

  readonly userIds = input<number[]>([]);
  readonly usersForLoad = input<ICredentialUser[]>([]);
  readonly maxSelectedLabels = input<number>();
  readonly showListNames = input<boolean>(false);
  readonly label = input<string>('Usuarios');
  readonly required = input<boolean>(false);
  readonly withFloatLabel = input<boolean>(true);
  readonly onSelectedUserIds = output<number[]>();

  private credencialService = inject(CredencialService);

  public readonly placeholders = PLACEHOLDERS;
  public users = signal<ICredentialUser[]>([]);
  public listSelected = signal<ICredentialUser[]>([]);
  public selectedUserIds = signal<number[]>([]);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();


  ngOnInit(): void {
    this.getUsers();
    if (this.usersForLoad()) {
      this.users.set(this.usersForLoad());
      const userIds: number[] = this.usersForLoad().map(user => user.credentialId);
      this.selectedUserIds.set(userIds);
      this.setUserIds(userIds);
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
          this.users.set([...this.listSelected(), ...res]);
        }
      });
    });
  }

  public onPanelHide() {
    this.users.set([...this.listSelected()])
  }
  
  public tryGetUsers(some: string) {
    if (some?.length >= 3) {
      this.searchSubject.next(some);
    }
  }

  public setUserIds(userIds: number[]) {
    this.onSelectedUserIds.emit(userIds);
    let list: ICredentialUser[] = [];
    userIds?.forEach( id => {
      list.push(this.users().find(e => e.credentialId == id))
    })
    this.listSelected.set(list);
  }

  public deleteUserOfList(userId: number) {
    const index = this.selectedUserIds().indexOf(userId);
    const copySelectedIds = [...this.selectedUserIds()];
    copySelectedIds.splice(index, 1);
    this.selectedUserIds.set(copySelectedIds);
    this.setUserIds(this.selectedUserIds());
  }

}
