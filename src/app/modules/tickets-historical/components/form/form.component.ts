import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TicketsService } from '../../services/tickets-.service';
import { DataCommon } from '@core/models/FieldsCommons';
import { Ticket, TicketSend } from 'src/app/core/models/Ticket';
import { TableComponent } from '../table/table.component';
import { ParametersService } from 'src/app/modules/parameters/services/parameters.service';
import { Parameter } from 'src/app/core/models/Parameter';
import { CategoriesService } from 'src/app/modules/categories/services/categories.service';
import { CategoryResponse } from 'src/app/core/models/Category';


declare var FileReader: any;
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private ticketsService = inject(TicketsService);
  private parametersService = inject(ParametersService);
  private categoriesService = inject(CategoriesService);

  categories = signal<CategoryResponse[]>([]);
  subCategories = signal<DataCommon[]>([]);
  priorities = signal<Parameter[]>([]);
  ticket!: Ticket;
  ticketSend = signal<TicketSend>(new TicketSend);
  openModal = false;
  tittleForm = signal("");
  isLoading = signal(false);
  imageTicket = signal("");
  uploadedImage = signal<any[]>([]);

  tableComponent!: TableComponent;

  ngOnInit() {
    this.ticketsService.eventFormComponent.emit(this);
    this.ticketsService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
    this.getCategories();
    this.getPriorities();
  };

  formTicket: FormGroup = this.formBuilder.group({
    id: [],
    image: [],
    title: [, Validators.required,],
    description: [, [Validators.required]],
    priorityId: [ 1, [Validators.required]],
    categoryId: [, Validators.required,],
    subCategoryId: [, Validators.required,],
  });

  cargarArchivo(event: any) {
    if ( event.currentFiles ) {
      const file = event.currentFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageTicket.set(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      this.imageTicket.set("");
    }
  }

  getCategories() {
    this.categoriesService.search('categoria').subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  getPriorities() {
    this.parametersService.search('prioridad').subscribe({
      next: (res) => {
        this.priorities.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  getSubCategories( id: number ) {
    this.ticketSend().subCategoryId = null;
    this.categoriesService.detailByCategory( id ).subscribe({
      next: (res) => {
        this.subCategories.set(res.filter( dato => dato.code != null ));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  hideModal() {
    this.openModal = false;
    this.isLoading.set(false);
  };

  openCreate(){
    this.reset();
    this.tittleForm.set("Nuevo Ticket");
    this.openModal = true;
  };

  openEdit(id: number ){
    this.reset();
    this.tittleForm.set("Editar Ticket");
    this.ticketsService.getById(id).subscribe({
      next: (res) => {
        this.ticketSend.set(res);
        this.openModal=true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  saveTicket() {
    this.isLoading.set(true);
    if (this.formTicket.valid) {
        this.submitCreate();
    }
  };

  reset(): void {
    this.formTicket.reset();
    this.ticketSend.set(new TicketSend);
  };

  submitCreate() {
    const data: TicketSend = {
      ...this.formTicket.value,
    };
    data.image = this.imageTicket();

    this.ticketsService.create(data).subscribe({
      next: (res) => {
        this.tableComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `El ticket ${res.title} ha sido creado.`, 3000);
        this.hideModal();
        this.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }
}
