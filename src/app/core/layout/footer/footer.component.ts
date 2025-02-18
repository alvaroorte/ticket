import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true
})
export class FooterComponent {
  fecha: Date = new Date;
  anio: number = this.fecha.getFullYear();
}
