import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

/**
 * Root component of the Angular application.
 *
 * This component:
 * - Acts as the application's main shell
 * - Provides space for routing via `<router-outlet>`
 * - Supplies navigation and layout structure
 * - Loads shared modules such as Router and Angular Material buttons
 *
 * It is marked as a **standalone component**, meaning it does not belong
 * to an NgModule and instead declares its own imports.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * AppComponent Constructor
   *
   * Currently empty because this component only serves as
   * the application's root container. Business logic and
   * presentation logic is handled by routed components.
   */
  constructor() {}
}
