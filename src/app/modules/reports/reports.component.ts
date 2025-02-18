import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsModule } from './reports.module';
import { HelpersService } from '@core/services/helpers.service';
import { ReportService } from './services/report.service';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReportsModule],
  templateUrl: './reports.component.html',
  providers: [HelpersService, HighchartsChartComponent]
})
export class ReportsComponent {

  private reportService = inject(ReportService);
  private helpersService = inject(HelpersService);

  getDashboard(data: any) {
    this.reportService.getDashboard(data).subscribe({
      next: (res) => {
        this.reportService.changeDataGraphics.emit(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }
}
