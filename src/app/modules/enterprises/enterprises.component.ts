import { Component, inject, signal } from '@angular/core';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { EnterprisesService } from './services/enterprises.service';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { EnterprisesModule } from './enterprises.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { EnterpriseCategoriesComponent } from '@enterpriseCategory/enterprise-categories.component';
import { EnterpriseCategoryDetailComponent } from '@enterpriseCategoryDetail/enterprise-category-detail.component';

@Component({
  selector: 'app-enterprises',
  standalone: true,
  imports: [EnterprisesModule, ModaldeleteComponent, ToolbarComponent, EnterpriseCategoriesComponent, EnterpriseCategoryDetailComponent],
  templateUrl: './enterprises.component.html',
  providers: [ HelpersService ]
})
export class EnterprisesComponent {

  enterprisesService = inject(EnterprisesService);

  enterprises = signal<Enterprise[]>([]);
  object = signal(new Enterprise);
  enterpriseCategory = signal(new EnterpriseCategory);

  ngOnInit(): void {
    this.object.set(new Enterprise);
  }

  setObject( object: Enterprise  ) {
    this.object.set(object);
  }

  setEnterpriseCategory( enterpriseCategory: EnterpriseCategory  ) {
    this.enterpriseCategory.set(enterpriseCategory);
  }
}

