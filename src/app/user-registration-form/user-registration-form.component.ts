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
  @Input() userData = { 
    username: '',   // lowercase - matches your backend
    password: '',   // lowercase - matches your backend
    email: '',      // lowercase - matches your backend
    Birthday: ''    // Capital B - matches your backend
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

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
        let errorMessage = 'Registration failed';
        
        // Check if there are validation errors
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