import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { environment } from '@core/environments/environment.development';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highcharts-gantt';

import HighchartsGantt from 'highcharts/modules/gantt';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

@Component({
  selector: 'app-modal-ticket-gant',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule, HighchartsChartModule ],
  templateUrl: './modal-ticket-gant.component.html',
})
export class ModalTicketGantComponent {

  @Input() idTicket = signal<number>(0);
  @Input() title: string = 'Reporte';

  private ticketService = inject(TicketsService);

  modalGantVisible: boolean = false;
  serverUrl: string = environment.server_url;

  ngOnInit(): void {
      this.ticketService.eventOpenReportGantt.subscribe( () => {
          this.openModalTimeline();
      })

      HighchartsGantt(Highcharts);
    HighchartsMore(Highcharts);
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
    });
  }

  openModalTimeline() {
      this.modalGantVisible = true;
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    lang: {
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdays:['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      viewFullscreen: "Ver Pantalla Completa",
      printChart: "Imprimir Gráfico",
      downloadPNG: "Descargar en PNG",
      downloadJPEG: "Descargar en JPEG",
      downloadPDF: "Descargar en PDF",
      downloadSVG: "Descargar en SVG"
  },
    title: {
      text: 'Gantt Chart with Progress Indicators',
    },
    xAxis: {
      min: Date.UTC(2022, 10, 17),
      max: Date.UTC(2023, 10, 30),
    },
    plotOptions: {
      series: {
        animation: false,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
        },
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {point.name}: ' +
        'Low <b>{point.start} NOK</b> - Median <b>{point.end} NOK</b> - High <b>{point.high} NOK</b><br/>',
    },
    series: [
      {
        type: 'gantt',
        name: 'Project 1',
        data: [
          {
            name: 'Planning',
            id: 'planning',
            start: Date.UTC(2023, 10, 17),
            end: Date.UTC(2023, 10, 30),
          },
          {
            name: 'Requirements',
            id: 'requirements',
            parent: 'planning',
            start: Date.UTC(2023, 10, 17),
            end: Date.UTC(2023, 10, 22),
          },
          {
            name: 'Develop',
            id: 'develop',
            dependency: 'requirements',
            parent: 'planning',
            start: Date.UTC(2023, 10, 22),
            end: Date.UTC(2023, 10, 30),
          },
        ],
      },
    ],
  };
}
