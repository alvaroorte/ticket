import { Component, input, viewChild, output } from '@angular/core';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { PickList, PickListMoveAllToSourceEvent, PickListMoveToTargetEvent } from 'primeng/picklist';
import { LABELS } from '@core/constants/labels';
import { ButtonProps } from 'primeng/button';

@Component({
    selector: 'app-table-double',
    imports: [PrimeModules],
    templateUrl: './table-double.component.html'
})
export class TableDoubleComponent<T> {
  readonly add = output<T[]>();
  readonly allAdd = output<T[]>();
  readonly remove = output<T[]>();
  readonly allRemove = output<T[]>();

  readonly sourceProducts = input.required<T[]>();
  readonly targetProducts = input.required<T[]>();

  readonly pickList = viewChild<PickList>('pickList');

  public readonly labels = LABELS;
  public readonly buttonProps: ButtonProps = {
    rounded: true,
    styleClass: 'shadow-3',
    severity: 'primary',
    size: 'small'
  }


  ngOnChanges(): void {
    this.pickList()? this.filterTables(): '';
  }

  public addItem(ev: PickListMoveToTargetEvent) {
    this.add.emit(ev.items);
  }

  public allAddItems(ev: PickListMoveAllToSourceEvent) {
    this.allAdd.emit(ev.items);
  }

  public removeItem(ev: PickListMoveToTargetEvent) {
    this.remove.emit(ev.items);
  }

  public allRemoveItems(ev: PickListMoveAllToSourceEvent) {
    this.allRemove.emit(ev.items);
  }

  private filterTables() {
    this.pickList().filter(this.sourceProducts(), -1);
    this.pickList().filter(this.targetProducts(), 1);
  }
}
