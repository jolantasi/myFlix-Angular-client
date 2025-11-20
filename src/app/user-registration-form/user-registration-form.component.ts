import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * The UserRegistrationFormComponent provides a modal dialog
 * that allows new users to register an account.
 *
 * Responsibilities:
 * - Displays a registration form
 * - Collects user input
 * - Sends registration data to the API
 * - Shows success or error messages via MatSnackBar
 * - Closes the dialog when registration succeeds
 *
 * This is a **standalone** component and imports all required dependencies directly.
 */
@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent {

  /**
   * User input model for registration.
   *
   * Backend requires:
   * - `username`
   * - `password`
   * - `email`
   * - `Birthday` (capital B — matches backend schema)
   */
  @Input() userData = { 
    username: '',
    password: '',
    email: '',
    Birthday: ''
  };

  /**
   * Creates a new registration form component.
   *
   * @param fetchApiData Service for API communication
   * @param dialogRef Reference to the currently opened dialog
   * @param snackBar Angular Material service for popup notifications
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Sends registration data to the backend.
   *
   * Workflow:
   * - Calls the API service to register the user
   * - On success: closes dialog + shows confirmation message
   * - On error: displays the backend validation errors
   */
  registerUser(): void {
    console.log('Registering user with data:', this.userData);
    
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        console.log('Registration successful:', result);
        this.dialogRef.close();
        this.snackBar.open('Registration successful! Please login.', 'OK', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Registration error:', error);

        // default fallback message
        let errorMessage = 'Registration failed';

        // Handle backend validation error format
        if (error.error?.errors) {
          errorMessage = error.error.errors.map((e: any) => e.msg).join(', ');
        } else if (error.error) {
          errorMessage = error.error;
        }
        
        this.snackBar.open(errorMessage, 'OK', {
          duration: 4000
        });
      }
    });
  }
}
