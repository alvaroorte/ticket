import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { CategoriesService } from '@category/services/categories.service';
import { PickListMoveAllToSourceEvent, PickListMoveToTargetEvent } from 'primeng/picklist';

@Component({
  selector: 'app-table-double',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule ],
  templateUrl: './table-double.component.html'
})
export class TableDoubleComponent {
  @Output() add = new EventEmitter<any>();
  @Output() allAdd = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() allRemove = new EventEmitter<any>();

  @Input() sourceProducts = signal<DataCommon[]>([]);
  @Input() targetProducts = signal<DataCommon[]>([]);
  @Input() serviceGeneric: any;

  ngOnInit() {
    this.serviceGeneric.eventTableDobleComponent.emit(this);
  }

  public addItem(ev: PickListMoveToTargetEvent){
    this.add.emit(ev.items);
  }

  public allAddItems(ev: PickListMoveAllToSourceEvent){
    this.allAdd.emit(ev.items);
  }

  public removeItem(ev: PickListMoveToTargetEvent){
    this.remove.emit(ev.items);
  }

  public allRemoveItems(ev: PickListMoveAllToSourceEvent){
    this.allRemove.emit(ev.items);
  }
}
