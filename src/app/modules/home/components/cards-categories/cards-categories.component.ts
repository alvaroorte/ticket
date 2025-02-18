import { Component, EventEmitter, Input, OnInit, Output, Signal, inject, signal } from '@angular/core';
import { CategoriesService } from '@category/services/categories.service';
import { Category, ServicesByUser } from '@core/models/Category';
import { Enterprise } from '@core/models/Enterprise';
import { HelpersService } from '@core/services/helpers.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginService } from '@core/services/login.service';
import { EnterprisesService } from '@enterprise/services/enterprises.service';

@Component({
    selector: 'app-cards-categories',
    templateUrl: './cards-categories.component.html'
})
export class CardsCategoriesComponent implements OnInit {

    @Input() category!: Signal<Category>;
    @Input() enterprise!: Signal<Enterprise>;
    @Input() numberColumns: Signal<number> = signal(3);
    @Output() selectedCategory = new EventEmitter<{category: Category, enterprise: Enterprise}>();
    @Output() selectedSubcategory = new EventEmitter<Category>();

    categories = signal<Category[]>([]);
    categoriesBase = signal<Category[]>([]);
    public enterprises: Enterprise[] = [];
    public enterpriseSelected!: Enterprise;
    havePermissions:boolean = false;

    categoriesService = inject(CategoriesService);
    enterprisesService = inject(EnterprisesService);
    helpersService = inject(HelpersService);
    loginService = inject(LoginService);
    localStorageService = inject(LocalStorageService);

    ngOnInit(): void {
       this.getData();
    }

    getData() {
        ( this.numberColumns() <= 3 )? this.getAllCategories(): this.getAllSubcategories();
    }

    getAllCategories() {
        this.categoriesService.listServices().subscribe({
            next: (res: ServicesByUser) => {
                const listWithoutParentheses: any = res.listServices?.map( category => {
                    let service = this.removeParentheses(category.service!);
                    while( service.indexOf('(') >= 0 ) {
                        service = this.removeParentheses(service);
                    }
                    return {
                        ...category,
                        service
                    }
                });
                const role = this.localStorageService.get('role');
                this.havePermissions = (role == 'leader' || role == 'technical' || role == 'supervisor')?? false;
                this.enterpriseSelected = res.enterprise;
                this.havePermissions? this.getEnterprises(): '';
                this.categories.set(listWithoutParentheses?? []);
                this.categoriesBase.set(listWithoutParentheses!);
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        });
    }

    private removeParentheses( text: string ) {
        let result = text?? '';
        if ( result && result.indexOf('(') >= 0 ) {
            result = text.substring(0, text.indexOf('(')) + text.substring(text.indexOf(')')+1, text.length);
        }
        return result;
    }

    getAllSubcategories() {
        const body = {
            enterprise: this.enterprise().id!,
            category: this.category().id!
        };
        this.categoriesService.getSubCategory(body).subscribe({
            next: (res) => {
                const listWithoutParentheses:any = res.map( subCategory => {
                    let service = (subCategory.name!.indexOf('(') >= 0)? subCategory.name!.substring(subCategory.name!.indexOf('(')+1, subCategory.name!.indexOf(')')): null;
                    return {
                        ...subCategory,
                        name: this.removeParentheses(subCategory.name!),
                        service
                    }
                });
                this.categories.set(listWithoutParentheses);
                this.categoriesBase.set(listWithoutParentheses);
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        });
    }

    setSelectedCategory(category: Category) {
        if ( this.numberColumns() <= 3 ) {
            if ( this.localStorageService.get('username') ) {
                category.folder = this.enterpriseSelected.domain;
                this.selectedCategory.emit({category, enterprise: this.enterpriseSelected});
            } else {
                this.loginService.eventOpenFormLogin.emit();
            }
        } else {
            this.selectedSubcategory.emit(category);
        }
    }

    public getEnterprises() {
        this.enterprisesService.search().subscribe({
            next: (res) => {
                this.enterprises = res;
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        });
    }

    public getCategoriesByEnterprise() {
      this.categoriesService.listServicesByEnterprise({ domain: this.enterpriseSelected.domain! }).subscribe({
            next: (res: ServicesByUser) => {
                const listWithoutParentheses: any = res.listServices?.map( category => {
                    let service = this.removeParentheses(category.service!);
                    while( service.indexOf('(') >= 0 ) {
                        service = this.removeParentheses(service);
                    }
                    return {
                        ...category,
                        service
                    }
                });
               this.categories.set(listWithoutParentheses?? []);
               this.categoriesBase.set(listWithoutParentheses!);
            },
            error: (err) => {
               console.log(err);
               this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
      });
    }

    async filterCategories( event: any ) {
        this.categories.set(await this.helpersService.filterOfArrayByFields(event.target.value,this.categoriesBase(), ['name'])!);
    }
}
