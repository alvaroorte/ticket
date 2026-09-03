import { Component, inject, OnDestroy, OnInit, signal, input, output } from '@angular/core';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { Subscription } from 'rxjs';
import { CategoryShort, SubcategoryShort } from '@core/models/Category';
import { Enterprise } from '@core/models/Enterprise';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { CategoryService } from '@category/services/categories.service';
import { removeTextIntoParentheses } from '@core/utils/format-value';
import { DerivationTicket } from '@core/models/Ticket';
import { CategoryFolderEnum } from '@core/enums/category-folder';

@Component({
    selector: 'app-modal-derivation',
    imports: [FormsModule, PrimeModules, ReactiveFormsModule],
    templateUrl: './modal-derivation.component.html'
})
export class ModalDerivationComponent implements OnInit, OnDestroy {

   readonly ticketId = input.required<number>();
   readonly eventOnDerivated = output<void>();
   
   private ticketService = inject(TicketService);
   private enterpriseService = inject(EnterpriseService);
   private categoryService = inject(CategoryService); 
   private helpersService = inject(HelpersService);
   private formBuilder = inject(FormBuilder);
   
   public readonly labels = LABELS;
   public openModal: boolean = false;
   public enterprises = signal<Enterprise[]>([]);
   public categories = signal<CategoryShort[]>([]);
   public subcategories = signal<SubcategoryShort[]>([]);
   private subscription: Subscription = new Subscription();
   public formDerivation: FormGroup = this.formBuilder.group({
    categoryId: [, [Validators.required]],
    subCategoryId: [, [Validators.required]],
    enterpriseId: [, [Validators.required]],
    ticketId: [, [Validators.required]]
  });

   ngOnInit() {
      this.subscription.add(
         this.ticketService.eventOpenModalDeribation.subscribe(() => {
            this.formDerivation.reset();
            this.formDerivation.patchValue({ticketId: this.ticketId()});
            this.getEnterprises();
         })
      )
   }

   ngOnDestroy(): void {
      this.subscription.unsubscribe();
   }

   public getEnterprises() {
      this.enterpriseService.select().subscribe({
         next: (res) => {
            this.enterprises.set(res);
         }, complete: () => {
            this.openModal = true;
         },
      });
   }

   public getCategoriesByEnterprise() {
      this.categoryService.getListCategoriesByEnterprise(this.formDerivation.value.enterpriseId, CategoryFolderEnum.Category).subscribe({
         next: (res: CategoryShort[]) => {
            const listCategoriesWithoutParentheses: CategoryShort[] = res.map( category => {
               category.name = removeTextIntoParentheses(category.name);
               return category;
            });
            this.categories.set(listCategoriesWithoutParentheses?? []);
         }
      });
   }

   public getSubcategories() {
      this.categoryService.getSubCategoriesByCategory(this.formDerivation.value.enterpriseId, this.formDerivation.value.categoryId).subscribe({
         next: (res) => {
            this.subcategories.set(res.map( subCategory => {
               subCategory.name = removeTextIntoParentheses(subCategory.name);
               return subCategory;
            }));
         }
      });
   }

   public derivateTicket() {
      const body: DerivationTicket = {
         ...this.formDerivation.value
      }
      this.ticketService.derivationTicket(body).subscribe({
         next: () => {
            this.helpersService.messageNotification(Severity.success, "Correcto", "Ticket derivado con exito.");
            this.openModal = false;
         }, complete: () => {
            this.eventOnDerivated.emit();
         }
      });
   }
}
