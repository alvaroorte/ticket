import { WritableSignal } from "@angular/core";
import { ModalDeleteComponent } from "@shared/components/modal-delete/modal-delete.component";
import { Observable } from "rxjs";
import { IGenericTable } from "./generic-table.interface";
import { IGenericModalForm } from "./generic-modal-form.interface";

export interface IServiceCommon {
    eventFormComponent: WritableSignal<IGenericModalForm>;
    eventTableComponent: WritableSignal<IGenericTable>;
    eventModalDeleteComponent: WritableSignal<ModalDeleteComponent>;
    delete(id: number): Observable<string>;
}