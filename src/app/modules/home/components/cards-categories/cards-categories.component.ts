import { Component, OnInit, inject, signal, output, input, effect } from '@angular/core';
import { CategoryService } from '@category/services/categories.service';
import { LABELS } from '@core/constants/labels';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { TOOLTIPS } from '@core/constants/tooltips';
import { CategoryShort, CategoryShortWithFilterSubcategory, CategoryWithEnterprise } from '@core/models/Category';
import { Enterprise } from '@core/models/Enterprise';
import { LoginService } from '@core/services/login.service';
import { filterOfArrayByFields } from '@core/utils/filter-by-fields';
import { removeTextIntoParentheses } from '@core/utils/format-value';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { CategoryFolderEnum } from '@core/enums/category-folder';
import { CardCategoryComponent } from '../card-category/card-category.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cards-categories',
    templateUrl: './cards-categories.component.html',
    imports: [CardCategoryComponent, PrimeModules, FormsModule],
    styleUrls: ['./cards-categories.component.scss']
})
export class CardsCategoriesComponent implements OnInit {

    readonly enterpriseId = input<number>();
    readonly onSelectedCategory = output<CategoryWithEnterprise>();
    
    private categoryService = inject(CategoryService);
    private enterpriseService = inject(EnterpriseService);
    private loginService = inject(LoginService);

    public readonly labels = LABELS;
    public readonly tooltips = TOOLTIPS;
    public categories = signal<CategoryShort[]>([]);
    private categoriesBase: CategoryShortWithFilterSubcategory[] = [];
    public enterprises = signal<Enterprise[]>([]);
    public enterpriseSelectedId = signal<number>(null);
    public searchInput = signal<string>('');
    public showEnterprise = signal<boolean>(false);

    constructor() {
        effect(() => {
            if (this.enterpriseId()) {
                this.enterpriseSelectedId.set(this.enterpriseId());
            }
        })
    }

    ngOnInit(): void {
        this.verifyRoleForShowEnterprise();
        this.getEnterprises()
    }
    
    private verifyRoleForShowEnterprise() {
        const isRoleTechnicianOrLeader = this.loginService.haveSomeRole([ROLES_CODE_SYSTEM.TECHNICIAN, ROLES_CODE_SYSTEM.LEADER]);
        this.enterpriseSelectedId.set(isRoleTechnicianOrLeader? null: this.loginService.enterpriseUserLogued().id);
        this.showEnterprise.set(isRoleTechnicianOrLeader);
    }
    
    public getCategoriesByEnterprise() {
        if (this.enterpriseSelectedId()) {
            this.categoryService.getListCategoriesByEnterprise(this.enterpriseSelectedId(), CategoryFolderEnum.Category).subscribe({
                next: (res: CategoryShort[]) => {
                    const listCategoriesWithoutParentheses: CategoryShort[] = res.map( category => {
                        return {
                            ...category,
                            name: removeTextIntoParentheses(category.name),
                            subCategories: category.subCategories.map(subCategory=> ({...subCategory, name: removeTextIntoParentheses(subCategory.name)}))
                        };
                    });
                    this.categories.set(listCategoriesWithoutParentheses?? []);
                    this.categoriesBase = this.addSubCategoryForFilter(listCategoriesWithoutParentheses);
                }
            });
        }
    }

    public setSelectedCategory(category: CategoryShort) {
        const enterprise = this.enterprises().find(e => e.id == this.enterpriseSelectedId());
        const data: CategoryWithEnterprise = {
            category,
            enterpriseId: this.enterpriseSelectedId()?? this.loginService.enterpriseUserLogued().id,
            enterpriseName: enterprise.name,
            hasCostCenter: enterprise.hasCostCenter
        }
        this.onSelectedCategory.emit(data);
    }

    public getEnterprises() {
        this.enterpriseService.select().subscribe({
            next: (res) => {
                this.enterprises.set(res);
                if (res.length === 1 && this.loginService.haveSomeRole([ROLES_CODE_SYSTEM.TECHNICIAN, ROLES_CODE_SYSTEM.LEADER]))
                    this.enterpriseSelectedId.set(res[0].id);
            },
            complete: () => {
                this.getCategoriesByEnterprise();   
            }
        });
    }

    private addSubCategoryForFilter( listCategories: CategoryShort[] ): CategoryShortWithFilterSubcategory[] {
        return listCategories.map( category => {
            return {
                ...category,
                subCategoriesForFilter: category.subCategories?.map( subCategory => subCategory.name ).join(', ')
            }
        });
    }

    public filterCategories() {
        this.categories.set(filterOfArrayByFields(this.searchInput(), this.categoriesBase, ['name', 'subCategoriesForFilter']));
    }
}
