import { Component, OnInit, signal, input, output } from '@angular/core';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { DataCommon } from '@core/models/FieldsCommons';
import { IMultiSelectOptions } from '@core/interfaces/multi-select.interface';
import { LABELS } from '@core/constants/labels';

@Component({
    selector: 'app-multi-select-generic',
    imports: [ReactiveFormsModule, PrimeModules, FormsModule],
    templateUrl: './multi-select-generic.component.html'
})
export class MultiSelectGenericComponent implements OnInit {

  readonly options = input<IMultiSelectOptions[]>([]);
  readonly selectedIds = input<number[]>([]);
  readonly maxSelectedLabels = input<number>();
  readonly showListNames = input<boolean>(false);
  readonly label = input<string>('Usuarios');
  readonly eventSelectedIds = output<number[]>();

  public readonly labels = LABELS;
  public selectedList = signal<DataCommon[]>([]);
  public selectedModelIds = signal<number[]>([]);

  ngOnInit(): void {
    if (this.selectedIds().length > 0) {
      this.selectedModelIds.set(this.selectedIds());
      this.setOptions(this.selectedModelIds());
    }
  }

  public setOptions(selectedIds: number[]) {    
    this.eventSelectedIds.emit(selectedIds);
    if (this.showListNames() && this.options().length > 0) {
      let list:IMultiSelectOptions[] = [];
      selectedIds?.forEach( id => {
        list.push(this.options().find(o => o.id === id))
      })
      this.selectedList.set(list);
    }
  }

  public deleteOptionOfList(userId: number) {
    const index = this.selectedModelIds().indexOf(userId);
    const copySelectedIds = [...this.selectedModelIds()];
    copySelectedIds.splice(index, 1);
    this.selectedModelIds.set(copySelectedIds);
    this.setOptions(this.selectedModelIds());
  }

}
