import { Component, inject, OnChanges, SimpleChanges, input, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DropdownCommonInterface } from '@core/interfaces/dropdow-common.interface';
import { HttpParamsTicketList } from '@core/interfaces/ticket.interface';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from '@core/services/login.service';
import { TYPE_VIEW_LIST_TICKET } from '@core/constants/ticket-view-type';
import { LABELS } from '@core/constants/labels';
import { TOOLTIPS } from '@core/constants/tooltips';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
  selector: 'app-toolbar-cards',
  imports: [
    FormsModule, 
    ButtonModule, 
    RippleModule, 
    TooltipModule, 
    RouterModule, 
    PrimeModules
  ],
  templateUrl: './toolbar-cards.component.html'
})
export class ToolbarCardsComponent implements OnChanges {

  readonly typeOfListTicket = input<string>();
  readonly onInputSearch = output<string>();
  readonly onReloadTickets = output<HttpParamsTicketList>();
  
  private loginService = inject(LoginService);

  public selectedOrderField: string;
  public searchInput: string = '';
  private selectedSort: string = '';
  public readonly typeOfListTicketMyTicket: string = TYPE_VIEW_LIST_TICKET.myTicket;
  public tooltipSearch: string;
  public readonly labels = LABELS;
  public readonly tooltips = TOOLTIPS;
  public orderFields: DropdownCommonInterface[] = [
    { label: LABELS.priority, value: 'priorityName' },
    { label: LABELS.status, value: 'flowStatusName' },
    { label: LABELS.technician, value: 'technician' },
    { label: LABELS.requester, value: 'requester' },
    { label: LABELS.enterprise, value: 'enterpriseCode' },
    { label: LABELS.date, value: 'createdAt' }
  ];
  public showButtonIncident: boolean = this.loginService.rolesUser().includes(ROLES_CODE_SYSTEM.MONITOR);


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeOfListTicket']) {
      this.resetParams();
      this.tooltipSearch = `Este campo busca por: Empresa, Código, Título, Solicitante, ${this.typeOfListTicket() == TYPE_VIEW_LIST_TICKET.pending? 'Etiqueta': 'Técnico'}, Estado y Prioridad`;
    }
  }

  public reloadTickets(): void {
    const params: HttpParamsTicketList = {
      sortBy: this.selectedOrderField?? '',
      sortOrder: this.selectedSort
    };
    this.onReloadTickets.emit(params);
  }

  private resetParams() {
    this.selectedOrderField = null,
    this.selectedSort = ''
    this.searchInput = '';
    this.filterTickets();
  }

  public filterTickets() {
    this.onInputSearch.emit(this.searchInput);
  }

  public setSort(sort: string) {
      this.selectedSort = sort;
      this.reloadTickets();
  }

}
