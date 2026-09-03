import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { TeamService } from '../../services/teams.service';
import { Team, TeamSend } from '@core/models/Team';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { Severity } from '@core/enums/severity';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { SelectGenericUsersComponent } from '../../../../shared/components/select-generic-users/select-generic-users.component';
import { MultiSelectGenericUsersComponent } from '../../../../shared/components/multi-select-generic-users/multi-select-generic-users.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { ICredentialUser } from '@core/interfaces/user.interface';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [ReactiveFormsModule, MessageRequiredFieldComponent, SelectGenericUsersComponent, MultiSelectGenericUsersComponent, PrimeModules]
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private teamService = inject(TeamService);

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.teamService.eventTableComponent;
  public teamEdited = signal<Team>(null);
  public teamMembers = signal<ICredentialUser[]>([]);
  private isEdit = false;

  public formTeam: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    leaderCredentialId: [, [Validators.required]],
    technicianCredentialsId: [],
    technicalAutomatic: [],
    active: [, [Validators.required]]
  });

  ngOnInit() {
    this.teamService.eventFormComponent.set(this);
  };

  public setLeader(userId: number) {
    this.formTeam.patchValue({ leaderCredentialId: userId })
  }
  
  public setTechnicianCredentialsId(ids: number[]) {
    this.formTeam.patchValue({ technicianCredentialsId: ids })
  }

  public hideModal() {
    this.openModal = false;
  };

  public openCreate() {
    this.isEdit = false;
    this.reset();
    this.titleForm = this.labels.newRegistration("equipo");
    this.openModal = true;
  };

  public openEdit(id: number ) {
    this.isEdit = true;
    this.reset();
    this.titleForm = this.labels.editRegistration("equipo");
    this.teamService.getById(id).subscribe({
      next: (res) => {
        this.formTeam.patchValue(res);
        this.teamEdited.set(res);
        this.teamMembers.set(res.teamMembers.map(member => ({email: member.technicianCredentialEmail, credentialId: member.technicianCredentialId})));
        this.openModal = true;
      }
    })
  };

  public saveTeam() {
    if (this.formTeam.valid ) {
      this.isEdit
        ? this.submit(TypeSubmitEnum.UPDATE)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.teamEdited.set(null);
    this.teamMembers.set([]);
    this.formTeam.reset();
    this.formTeam.patchValue({
      technicalAutomatic: true,
      active: true
    });
  };

  private submit(type: TypeSubmitEnum) {
    const data: TeamSend = {
      ...this.formTeam.value
    };
    const service = type == TypeSubmitEnum.CREATE?
      this.teamService.create(data)
      : this.teamService.update(this.teamEdited().id, data);
    const message: string = type == TypeSubmitEnum.CREATE?
      this.messages.recordCreated
      : this.messages.recordUpdated;
    service.subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", message);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };

}
