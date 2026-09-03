import { Component, OnChanges, OnInit, input } from '@angular/core';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import * as Highcharts from 'highcharts/highcharts-gantt';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import { HighchartsChartModule } from 'highcharts-angular';
import { ScheduleDetail } from '@core/interfaces/schedule-detail.interface';
import { orderDaysToGantt } from '@core/constants/days';
import { highchartsSetOptions } from '@core/constants/highchart-options';

const WORK_COLOR = '#14b84f';
const BREAK_COLOR = 'gray';

@Component({
    selector: 'app-gantt-for-hours-of-week',
    imports: [PrimeModules, HighchartsChartModule],
    templateUrl: './gantt-for-hours-of-week.component.html',
    styles: []
})
export class GanttForHoursOfWeekComponent implements OnInit, OnChanges {

  readonly hoursWithDays = input.required<ScheduleDetail[]>();

  public chartOptions: Highcharts.Options | undefined;
  public Highcharts: typeof Highcharts = Highcharts;

  ngOnInit(): void {
    HighchartsExporting(Highcharts);
    HighchartsExportData(Highcharts);
    HighchartsAccessibility(Highcharts);
    Highcharts.setOptions(
      highchartsSetOptions
    );
  }

  ngOnChanges(): void {
    this.buildChartOptions()
  }

  private orderScheduleByDays(hoursWithDays: ScheduleDetail[]): ScheduleDetail[] {
    return orderDaysToGantt.reduce( (result, day) => {
      const dayWithHoours = hoursWithDays.find( r => r.dayOfWeek == day );
      if (dayWithHoours) result.push(dayWithHoours);
      return result;
    }, [] as ScheduleDetail[])
  }

  private parseTime(time: string, currentYear: number): number {
    const [hour, minute] = time.split(':').map(Number);
    return new Date(currentYear, 0, 1, hour, minute).getTime();
  }

  private getDataForSerie(arrayDays: ScheduleDetail[]): Highcharts.GanttPointOptionsObject[] {
    const currentYear = new Date().getFullYear();

    return arrayDays.reduce( (result: Highcharts.GanttPointOptionsObject[], row: ScheduleDetail, index) => {
      result.push({
        name: row.dayOfWeek,
        start: this.parseTime(row.startHour, currentYear),
        end: this.parseTime(row.breakStartHour, currentYear),
        color: WORK_COLOR,
        description: "Mañana",
        y: index
      });
      result.push({
        name: row.dayOfWeek,
        start: this.parseTime(row.breakStartHour, currentYear),
        end: this.parseTime(row.breakEndHour, currentYear),
        color: BREAK_COLOR,
        description: "Almuerzo",
        y: index
      });
      result.push({
        name: row.dayOfWeek,
        start: this.parseTime(row.breakEndHour, currentYear),
        end: this.parseTime(row.endHour, currentYear),
        color: WORK_COLOR,
        description: "Tarde",
        y: index
      });
      return result;
    }, [] as Highcharts.GanttPointOptionsObject[])
  }

  private buildChartOptions() { 
    const daysOrdered: ScheduleDetail[] = this.orderScheduleByDays(this.hoursWithDays());
    const dataToSerie: Highcharts.GanttPointOptionsObject[] = this.getDataForSerie(daysOrdered);
    const serie: Highcharts.SeriesOptionsType[] = [{
      type: "gantt",
      name: "Horarios",
      data: dataToSerie
    }];

    this.chartOptions = {
      chart: {
        inverted: true,
        plotBorderWidth: 2
      },
      title: {
        text: 'Horarios',
      },
      xAxis: [{
        opposite: false,
        title: {
          text: "Hrs.",
          textAlign: "left",
          x: -18,
          style: {
            fontSize: "1.2rem",
            fontWeight: "700"
          }
        }
      }],
      yAxis: {
        uniqueNames: true,
        opposite: true,
        borderWidth: 1
      } as Highcharts.YAxisOptions,
      series: serie,
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.description}',
            style: {
              fontWeight: 'normal',
              textOverflow: 'ellipsis',
            },
          }
        }
      }
    };
  }

}
