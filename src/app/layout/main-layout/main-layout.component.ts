import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, HeaderComponent, SidebarComponent, LoadingOverlayComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly menuOpen = signal(false);
}
