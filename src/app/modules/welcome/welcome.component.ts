import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements AfterViewInit {

  public hideBorderTyping = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hideBorderTyping = true;
    }, 3100);
  }
}
