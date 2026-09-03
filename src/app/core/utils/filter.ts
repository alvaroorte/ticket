import { FilterMetadata } from "primeng/api";
import { HttpParams } from "@angular/common/http";
import { TableLazyLoadEvent } from "primeng/table";
import { Pageable } from "@core/models/pageable";

export function changeTableLazyloadEventToParams(event: TableLazyLoadEvent): HttpParams {
  let params: HttpParams = new Pageable().getPageableAsHttpParams(event);
  params = filterOfColumnsToParams(event.filters, params);
  return params;
}

const filterOfColumnsToParams = (filters: { [s: string]: FilterMetadata[] | FilterMetadata }, params: HttpParams = new HttpParams()): HttpParams => {
  Object.keys(filters).forEach((key: string) => {
    if (Array.isArray(filters[key])) {
      const arrayFilters: FilterMetadata[] = filters[key] as FilterMetadata[];
      const arrayFilterValue: string = arrayFilters[0].value;
      arrayFilterValue? params = params.set(key, arrayFilterValue): ''
    }
  });
  return params;
}
