import { Component, input } from '@angular/core';
import { LABELS } from '@core/constants/labels';
import { CategoryShort } from '@core/models/Category';

@Component({
    selector: 'app-card-category',
    templateUrl: './card-category.component.html',
    styleUrls: ['./card-category.component.scss']
})
export class CardCategoryComponent {

    readonly category = input.required<CategoryShort>();
    
    public readonly labels = LABELS;

}
