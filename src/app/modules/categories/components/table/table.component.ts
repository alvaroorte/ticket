import { Component, EventEmitter, Input, OnChanges, Output, Signal, SimpleChanges, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Category, CategoryResponse } from 'src/app/core/models/Category';
import { CategoriesService } from '../../services/categories.service';
import { CategoriesComponent } from '../../categories.component';
import { HelpersService } from '@core/services/helpers.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})

export class TableComponent implements OnChanges {
  @Input() categories: Signal<CategoryResponse[]> ;
  @Input() title: string = "Listado";
  @Output() changeCategory = new EventEmitter<any>();

  public selectedCategory: Category = new Category;
  public firstPage = 0;
  public optionsPage = signal([5, 10, 20]);
  public loading = signal(false);
  
  private categoriesComponent = inject(CategoriesComponent);
  private categoriesService = inject(CategoriesService);
  private helpersService = inject(HelpersService);

  ngOnInit() {
      this.categoriesService.eventTableComponent.emit(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["title"]) {
      this.onRowUnselect();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.categoriesComponent.getAll();
    this.firstPage = 0;
    this.onRowUnselect();
  }

  onRowSelect(event: any) {
    this.selectedCategory = event.data;
    this.changeCategory.emit(this.selectedCategory);
  }

  onRowUnselect() {
    this.selectedCategory = new Category;
    this.changeCategory.emit(this.selectedCategory);
  }

  switchStatus(category: Category){
      this.loading.set(true);
      const id = Number(category.id);
      let categorySend = category
      this.categoriesService.update(id,categorySend).subscribe({
         next:resp=>{
            this.loading.set(false);
         },
         error: (err) => {
            this.loading.set(false);
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      });
  }
}
