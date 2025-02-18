import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphGanttService {
  
  @Output() eventOpenModalGrapGantt: EventEmitter<any> = new EventEmitter();

}
