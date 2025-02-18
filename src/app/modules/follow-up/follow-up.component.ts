import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsModule } from './follow-up.module';
import { HelpersService } from '@core/services/helpers.service';
import { FollowUpService } from './services/follow-up.service';
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-follow-up',
  standalone: true,
  imports: [CommonModule, ReportsModule],
  templateUrl: './follow-up.component.html',
  providers: [HelpersService, HighchartsChartComponent]
})
export class FollowUpComponent {

  private reportService = inject(FollowUpService);
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
