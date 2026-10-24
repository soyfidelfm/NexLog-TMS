import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatService } from '../../features/chat/services/chat.service';
import { ChatPanelComponent } from '../../features/chat/ui/chat-panel.component';
import { ToastContainerComponent } from '../../shared/toast/toast-container.component';
import { LoadingOverlayComponent } from '../../shared/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, HeaderComponent, SidebarComponent, LoadingOverlayComponent, ChatPanelComponent, ToastContainerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly menuOpen = signal(false);

  constructor() {
    // Loads conversations + notifications and (live mode) opens the realtime hub for the signed-in session.
    inject(ChatService).start();
  }
}
