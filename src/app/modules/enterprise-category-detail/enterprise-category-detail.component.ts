import { Component, Input, Signal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseCategoryDetailModule } from './enterprise-category-detail.module';
import { Enterprise } from '@core/models/Enterprise';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { EnterpriseCategoryDetailService } from './services/enterpriseCategoryDetail.service';
import { EnterpriseCategoryDetail } from '@core/models/EnterpriseCategoryDetail';

@Component({
  selector: 'app-enterprise-category-detail',
  standalone: true,
  imports: [CommonModule, EnterpriseCategoryDetailModule, ToolbarComponent],
  templateUrl: './enterprise-category-detail.component.html'
})
export class EnterpriseCategoryDetailComponent {
  @Input() enterprise!: Signal<Enterprise>;
  @Input() enterpriseCategory!: Signal<EnterpriseCategory>;

  enterpriseCategoryDetailService = inject(EnterpriseCategoryDetailService);

  enterpriseCategoryDetail = signal<EnterpriseCategoryDetail>(new EnterpriseCategoryDetail);

  setEnterpriseCategory( enterpriseCategoryDetail: EnterpriseCategoryDetail ) {
    this.enterpriseCategoryDetail.set(enterpriseCategoryDetail);
  }
}
