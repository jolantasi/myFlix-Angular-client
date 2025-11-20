import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * The UserLoginFormComponent provides a modal dialog
 * that allows existing users to log in.
 *
 * Responsibilities:
 * - Collects username & password
 * - Sends credentials to the backend for verification
 * - Saves returned auth token and user data in localStorage
 * - Shows success/error notifications via MatSnackBar
 * - Closes dialog and navigates to the movie view upon success
 *
 * This is a **standalone** Angular component and imports
 * all required Angular Material & Angular modules directly.
 */
@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent {

  /**
   * Two-way-bound model holding the login form input.
   *
   * Backend requires:
   * - `username`
   * - `password`
   */
  userData = {
    username: '',
    password: ''
  };

  /**
   * Creates the login form component.
   *
   * @param fetchApiData Service handling communication with the backend API
   * @param snackBar Material service for showing popup messages
   * @param router Angular router used to redirect the user after login
   * @param dialogRef Reference to the currently opened dialog
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<UserLoginFormComponent>
  ) {}

  /**
   * Sends login credentials to the backend.
   *
   * Workflow:
   * - Calls `userLogin()` from the API service
   * - On success:
   *   - Saves JWT token to localStorage
   *   - Saves user object to localStorage
   *   - Closes the dialog
   *   - Navigates to the `/movies` route
   * - On error: displays a failure message
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (resp: any) => {
        console.log('Login response:', resp);

        // Save authentication data if provided
        if (resp.token) {
          localStorage.setItem('token', resp.token);
        }
        if (resp.user) {
          localStorage.setItem('user', JSON.stringify(resp.user));
        }

        this.snackBar.open('Login successful', 'OK', { duration: 2000 });
        this.dialogRef.close();
        this.router.navigate(['movies']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.snackBar.open('Login failed - check your credentials', 'OK', {
          duration: 3000
        });
      }
    });
  }
}
