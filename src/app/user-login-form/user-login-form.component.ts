import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  standalone: false,
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  // ✅ Must match your API field names exactly:
  userData = { username: '', password: '' };

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // ✅ Store token and user info in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // ✅ Close the dialog
        this.dialogRef.close();

        // ✅ Navigate to movies page (after login)
        this.router.navigate(['movies']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your username and password.');
      }
    });
  }
}
