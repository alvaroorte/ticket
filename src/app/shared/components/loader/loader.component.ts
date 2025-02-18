import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LoaderComponent {
  isLoading = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) {}
}
