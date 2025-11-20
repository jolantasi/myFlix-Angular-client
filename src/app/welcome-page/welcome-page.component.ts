import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

/**
 * The Welcome Page component serves as the landing screen of the application.
 *
 * Responsibilities:
 * - Provides entry points for **Login**, **Registration**, and **Browsing Movies**
 * - Opens Angular Material dialogs for login and registration forms
 * - Navigates to the movies route when requested
 *
 * This is a **standalone** component, meaning it imports all required Angular
 * modules directly instead of relying on an NgModule.
 */
@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {

  /**
   * Creates a new instance of WelcomePageComponent.
   *
   * @param dialog - Angular Material dialog service used to open modal dialogs
   * @param router - Angular router used for navigation between views
   */
  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {}

  /**
   * Opens the **User Registration Form** inside a modal dialog.
   * Triggered when the user clicks the "Sign Up" button.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  /**
   * Opens the **User Login Form** inside a modal dialog.
   * Triggered when the user clicks the "Login" button.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }

  /**
   * Navigates the user to the **Movies** view.
   * Triggered when clicking the "All Movies" button.
   */
  openMoviesDialog(): void {
    this.router.navigate(['movies']);
  }
}
