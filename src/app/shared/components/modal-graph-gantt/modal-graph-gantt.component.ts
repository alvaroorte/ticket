import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { GraphGanttService } from '@core/services/graph-gantt.service';
import * as Highcharts from 'highcharts/highcharts-gantt';
import { Gantt } from '@core/models/gantt';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { HighchartsChartModule } from 'highcharts-angular';
import { highchartsSetOptions } from '@core/constants/constants';

@Component({
  selector: 'app-modal-graph-gantt',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule, HighchartsChartModule],
  templateUrl: './modal-graph-gantt.component.html'
})
export class ModalGraphGanttComponent implements OnInit {

  public title: string = 'Diagrama de tiempos';
  public showModalGantt: boolean = false;
  public chartOptions!: Highcharts.Options;
  private series: Highcharts.SeriesOptionsType[] | any;
  public Highcharts: typeof Highcharts = Highcharts;

  private graphGanttService = inject(GraphGanttService);

  ngOnInit(): void {
    HighchartsExporting(Highcharts);
    HighchartsExportData(Highcharts);
    Highcharts.setOptions(
      highchartsSetOptions
    );
    this.graphGanttService.eventOpenModalGrapGantt.subscribe( (res: {title: string, serie: Gantt[]}) => {
      this.title = res.title;
      this.mapperGrah(res.serie)
    })
  }

  private mapperGrah(data: Gantt[]) {
    this.series = data.map(function (row, i: number) {
      const data = row.dates.map(function (date) {
        return {
          id: 'date-' + i,
          rentedTo: date.inHandsOf,
          start: date.createdAt,
          end: date.closeAt,
          y: i,
          name: date.inHandsOf,
        };
      });
      return {
        name: row.status,
        data: data
      };
    });

    this.chartOptions = {
      title: {
        text: 'Diagrama de tiempos',
      },
      xAxis: {
        currentDateIndicator: true,
      },
      yAxis: {
        type: 'category',
        grid: {
          columns: [
            {
              title: {
                text: 'Estado',
              },
              categories: this.series.map(function (s: Highcharts.SeriesOptionsType) {
                return s.name!;
              }),
            }
          ]
        }
      },
      series: this.series,
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              fontWeight: 'normal',
              textOverflow: 'ellipsis',
            },
          },
        },
      }
    };

    this.showModalGantt = true;
  }
}
