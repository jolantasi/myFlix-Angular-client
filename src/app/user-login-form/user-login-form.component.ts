import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent {
  userData = {
    username: '',
    password: ''
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<UserLoginFormComponent>  // 👈 wichtig
  ) {}

  loginUser(): void {
  // 👇 map from your form fields (lowercase) to backend fields (capitalized)
  const loginPayload = {
    Username: this.userData.username,
    Password: this.userData.password
  };

  this.fetchApiData.userLogin(loginPayload).subscribe({
    next: (resp: any) => {
      console.log('Login response:', resp);

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
      this.snackBar.open('Login failed', 'OK', { duration: 2000 });
    }
  });
}

}
