import { Component, inject, signal } from '@angular/core';
import { FollowUpService } from '../../services/follow-up.service';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { AverageByTypeticket } from '@core/models/Report';
import { FollowUpResponse } from '@core/models/Follow-up';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styles: [
    `.p-card .p-card-content { padding: 0 !important; }`
  ]
})
export class GraphicsComponent {

  private reportService = inject(FollowUpService);
  
  updateFlag = signal<boolean>(false);
  averageByTypeticket = signal<AverageByTypeticket[]>([]);
  Highcharts: typeof Highcharts = Highcharts;

  graphics = signal<any[]>([]);
  
  ngOnInit(): void {
    this.reportService.changeDataGraphics.subscribe( (res: FollowUpResponse) => {
      this.updateFlag.set(false);
      this.averageByTypeticket.set(res.averageByTypeticket);
      this.graphics.set(JSON.parse(res.hoursFollow));
    })
    HighchartsExporting(Highcharts);
    HighchartsExportData(Highcharts);

    Highcharts.setOptions({
      lang: {
        months: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        weekdays: [
          'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
        ],
        shortMonths: [
          'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ],
        rangeSelectorFrom: 'Desde',
        rangeSelectorTo: 'Hasta',
      },
      colors: ['#64748b', '#c9a328', '#3d86eb', '#46d491', '#f59823', '#f52323', 'efd70d', '#42e2c0', '#7d19e1', '#e8137b']
    });
  }
}
