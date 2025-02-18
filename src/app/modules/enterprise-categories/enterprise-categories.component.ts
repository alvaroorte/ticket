import { Component, EventEmitter, Input, Output, Signal, inject, signal } from '@angular/core';
import { EnterpriseCategoriesModule } from './enterprise-categories.module';
import { Enterprise } from '@core/models/Enterprise';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { EnterpriseCategoriesService } from './services/enterpriseCategories.service';

@Component({
  selector: 'app-enterprise-categories',
  standalone: true,
  imports: [ EnterpriseCategoriesModule, ToolbarComponent],
  templateUrl: './enterprise-categories.component.html'
})
export class EnterpriseCategoriesComponent {
  @Input() enterprise!: Signal<Enterprise>;
  @Output() changeEnterpriseCategory = new EventEmitter<EnterpriseCategory>();

  enterpriseCategoryService = inject(EnterpriseCategoriesService);

  enterpriseCategory = signal<EnterpriseCategory>(new EnterpriseCategory);

  setEnterpriseCategory( enterpriseCategory: EnterpriseCategory ) {
    this.enterpriseCategory.set(enterpriseCategory);
    this.changeEnterpriseCategory.emit(enterpriseCategory);
  }
}
