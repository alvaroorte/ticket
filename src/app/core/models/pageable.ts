import { HttpParams } from '@angular/common/http';
import { TableLazyLoadEvent } from 'primeng/table';

export class Pageable {
  page: number | string = '';
  size: number | string = '';
  sortBy: string = '';
  sortOrder: string = '';
  
  public getPageableAsHttpParams(event: TableLazyLoadEvent): HttpParams {
    const { first, rows, sortOrder, sortField, globalFilter } = event;
    const params = new HttpParams()
    .set('page', first / rows)
    .set('size', rows)
    .set('sortOrder', !sortOrder || sortOrder === 1 ? 'asc' : 'desc')
    .set('sortBy', sortField? sortField.toString(): 'id')
    .set('some', globalFilter? globalFilter.toString(): '')
    return params;
  }
}
