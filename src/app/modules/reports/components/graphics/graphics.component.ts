import { Component, inject, signal } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { environment } from '@core/environments/environment.development';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { AverageByTypeticket, DashboardResponse } from '@core/models/Report';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styles: [
    `.p-card .p-card-content { padding: 0 !important; }`
  ]
})
export class GraphicsComponent {

  private initialData: Highcharts.SeriesOptionsType[] = [{ name: 'Sin datos', data: [{ name: "Sin datos", y: 1 }], type: 'pie' }];

  private reportService = inject(ReportService);

  serverUrl: string = environment.server_url;

  updateFlag = signal<boolean>(false);
  categorySerie = this.initialData;
  subCategorySerie = this.initialData;
  impactSerie = this.initialData;
  motiveSerie = this.initialData;
  acceptanceSerie = this.initialData;
  categoriesTechnicals: any = [];
  technicalSerie = this.initialData;
  averageByTypeticket = signal<AverageByTypeticket[]>([]);
  chartOptionsCategorySerie = signal<Highcharts.Options>({});
  chartOptionsSubCategorySerie = signal<Highcharts.Options>({});
  chartOptionsImpactSerie = signal<Highcharts.Options>({});
  chartOptionsMotiveSerie = signal<Highcharts.Options>({});
  chartOptionsAcceptance = signal<Highcharts.Options>({});
  chartOptionsTechnicals = signal<Highcharts.Options>({});
  Highcharts: typeof Highcharts = Highcharts;

  ngOnInit(): void {
    this.setDataGraphics();
    this.reportService.changeDataGraphics.subscribe( (res: DashboardResponse) => {
      this.updateFlag.set(false);
      this.averageByTypeticket.set(res.averageByTypeticket);
      this.mapperDataGraphics(res);
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

  mapperDataGraphics( data: DashboardResponse ) {
    this.categorySerie = JSON.parse(data.categorySerie);
    this.subCategorySerie = JSON.parse(data.subCategorySerie);
    this.impactSerie = JSON.parse(data.impactSerie);
    this.motiveSerie = JSON.parse(data.motiveSerie);
    this.acceptanceSerie = JSON.parse(data.acceptance);
    this.categoriesTechnicals = JSON.parse(data.technical.key);
    this.technicalSerie = JSON.parse(data.technical.value);
    this.setDataGraphics();
  }

  setDataGraphics() {
    this.chartOptionsCategorySerie.set({
      title: {
        text: 'Categorías'
      },
      series: this.categorySerie
    });

    this.chartOptionsSubCategorySerie.set({
      title: {
        text: 'Subcategoría'
      },
      series: this.subCategorySerie
    });

    this.chartOptionsImpactSerie.set({
      title: {
        text: 'Impacto'
      },
      series: this.impactSerie
    });

    this.chartOptionsMotiveSerie.set({
      title: {
        text: 'Motivo'
      },
      series: this.motiveSerie
    });

    this.chartOptionsAcceptance.set({
      title: {
        text: 'Aceptación'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
        }
      },
      series: this.acceptanceSerie
    });

    
    this.chartOptionsTechnicals.set({
      xAxis: {
        categories: this.categoriesTechnicals
      },
      title: {
        text: 'Técnicos'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: this.technicalSerie
    });
    setTimeout(() => {
      ( this.categoriesTechnicals && this.categoriesTechnicals.length > 0 )? this.updateFlag.set(true): this.updateFlag.set(false);
    }, 500);
  }
}
