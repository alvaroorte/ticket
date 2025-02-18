import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home.module';
import { HelpersService } from '@core/services/helpers.service';
import { Category } from '@core/models/Category';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { DerivationTicket, TicketById, TicketSend } from '@core/models/Ticket';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { FormTicketCommonComponent } from '@shared/components/form-ticket-common/form-ticket.component';
import { FileService } from '@core/services/fileService';
import { Enterprise } from '@core/models/Enterprise';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeModule, StepperComponent, FormTicketCommonComponent],
  templateUrl: './home.component.html',
  providers: [ HelpersService ]
})
export class HomeComponent implements OnInit {

    @Input() idRecursive: number | null = null;
    @Input() dataRecursive!: TicketById;
    @Input() isDerivation: boolean = false;
    @Output() eventTicketCreated = new EventEmitter();

    public indexCurrent = signal<number>(1);
    public numberColumns = signal<number>(4);
    public steps = signal<string[]>(['Categoría', 'Subcategoría', 'Datos Ticket']);
    public category = signal<Category>(new Category);
    public enterprise = signal<Enterprise>(new Enterprise);
    private subcategory = signal<Category>(new Category);
    public showUploadFile = signal(true);

    private ticketsService = inject(TicketsService);
    private fileService = inject(FileService);
    private helpersService = inject(HelpersService);

    ngOnInit(): void {
        this.resetForm();
    }

    private resetForm() {
        this.changeIndex(1);
        this.category.set(new Category);
        this.steps.update((current) => {
            let result: string[] = current;
            result[0] = "Categoría";
            return result;
        });
    }

    public changeIndex(index: number) {
        switch (index) {
            case 1:
                this.steps.update((current) => {
                    let result: string[] = current;
                    result[1] = "Subcategoría";
                    return result;
                });
                this.subcategory.set(new Category);
                break;
            case 2:
                if (!this.category().name) {
                    this.helpersService.messageNotification("warn", 'Por favor', 'Seleccione una categoría primero', 3000);
                    index = this.indexCurrent();
                }
                break;
            case 3:
                if (!this.category().name) {
                    this.helpersService.messageNotification("warn", 'Por favor', 'Seleccione una categoría primero', 3000);
                    index = this.indexCurrent();
                } else if (!this.subcategory().name) {
                    this.helpersService.messageNotification("warn", 'Por favor', 'Seleccione una subcategoría primero', 3000);
                    index = this.indexCurrent();
                }
            break;

            default:
                break;
        }
        this.indexCurrent.set(index);
    };

    public setSelectedCategory(data: {category: Category, enterprise: Enterprise}) {
        this.category.set(data.category);
        this.enterprise.set(data.enterprise);
        this.steps.update((current) => {
            let result: string[] = current;
            result[0] = "Categoria: " + data.category.name;
            return result;
        });
        this.indexCurrent.set(2);
    }

    public setSelectedSubcategory(subcategory: Category) {
        this.subcategory.set(subcategory);
        if ( this.isDerivation ) {
            this.updateTicket()
        } else {
            this.steps.update((current) => {
                let result: string[] = current;
                result[1] = "Subcategoría: " + subcategory.name;
                return result;
            })
            this.indexCurrent.set(3);
        }
    }

    public createTicket(dataTicket: any) {
        let data: TicketSend = new TicketSend();
        data.idRecursive = this.idRecursive,
        data.categoryId = this.category().id,
        data.subCategoryId = this.subcategory().id,
        data.title = dataTicket.values.title,
        data.description = dataTicket.values.description,
        data.priorityId = dataTicket.values.priorityId,
        data.ubication = dataTicket.values.ubication,
        data.phone = dataTicket.values.phone,
        data.image = "",
        data.domain = dataTicket.values.domain
        this.ticketsService.create(data).subscribe({
            next: (res) => {
                this.eventTicketCreated.emit();
                this.resetForm();
                ( data.idRecursive )? '': this.helpersService.messageNotification("success", "Correcto", `El ticket ${res.title} ha sido creado.`, 3000);
                ( dataTicket.file )? this.fileService.subirArchivo(dataTicket.file, '', res.id as number): '';
            },
            error: (err) => {
                console.log(err);
                ( data.idRecursive )? '': this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        })
    }

    private updateTicket() {
        const data: DerivationTicket = {
            categoryId: this.category().id!,
            subCategoryId: this.subcategory().id!,
            domain: this.category().folder!,
            description: this.dataRecursive.description,
            priorityId: this.dataRecursive.priorityId
        }
        this.ticketsService.derivationTicket(this.idRecursive!, data).subscribe({
            next: () => {
                this.eventTicketCreated.emit();
                this.resetForm();
                this.helpersService.messageNotification("success", "Correcto", `El ticket se derivó correctamente.`, 3000);
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err, 3000);
            }
        });
    }
}
