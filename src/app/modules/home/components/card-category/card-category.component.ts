import { Component, EventEmitter, Input, OnInit, Output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '@core/models/Category';

@Component({
    selector: 'app-card-category',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-category.component.html',
    styleUrls: ['./card-category.component.scss']
})
export class CardCategoryComponent implements OnInit {

    @Input() categories!: Signal<Category[]>;
    @Input() columnsNumber!: number;
    @Output() selectedCategory = new EventEmitter<Category>();
    classMain: string = "";

    ngOnInit(): void {
        this.classMain = `col-12 md:col-6 lg:col-${(12/this.columnsNumber)} align-items-center container justify-content-center ${ (this.columnsNumber <= 3)? 'fadeinleft': 'fadeinright'} animation-ease-in-out animation-duration-500`;
    }

    setSelectedCategory ( category: Category ) {
        this.selectedCategory.emit(category);
    }
}
