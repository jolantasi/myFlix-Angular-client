import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  isEditMode: boolean = false;
  originalUsername: string = '';
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // ✅ SINGLE source of truth for loading user + favorites
  loadUserProfile(): void {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      this.user = parsedUser;

      // store the current username from backend
      this.originalUsername = parsedUser.username || parsedUser.Username;

      // load favorite movies based on FavoriteMovies IDs
      this.loadFavoriteMovies();
    } else {
      this.router.navigate(['welcome']);
    }
  }

  loadFavoriteMovies(): void {
  // ✅ support both FavoriteMovies and favoriteMovies
  const favorites = this.user.FavoriteMovies || this.user.favoriteMovies;

  if (!favorites || favorites.length === 0) {
    this.favoriteMovies = [];
    return;
  }

  this.fetchApiData.getAllMovies().subscribe({
    next: (movies) => {
      this.favoriteMovies = movies.filter((movie: any) =>
        favorites.some((fav: any) => {
          // favorites as plain ID strings
          if (typeof fav === 'string') {
            return fav === movie._id;
          }
          // favorites as objects from backend
          if (fav && typeof fav === 'object') {
            return fav._id === movie._id || fav === movie._id;
          }
          return false;
        })
      );

      console.log('Favorites from user:', favorites);
      console.log('Resolved favoriteMovies:', this.favoriteMovies);
    },
    error: () => {
      this.favoriteMovies = [];
    }
  });
}

removeFavorite(movieId: string): void {
  const username = this.user.username;

  this.fetchApiData.removeFavoriteMovie(username, movieId).subscribe({
    next: () => {
      // Update local favorites array
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);

      // Update user object in localStorage
      const favorites = this.user.FavoriteMovies || this.user.favoriteMovies || [];
      const updatedFavorites = favorites.filter((fav: any) => {
        if (typeof fav === 'string') {
          return fav !== movieId;
        }
        if (fav && typeof fav === 'object') {
          return fav._id !== movieId;
        }
        return true;
      });

      if (this.user.FavoriteMovies) {
        this.user.FavoriteMovies = updatedFavorites;
      } else {
        this.user.favoriteMovies = updatedFavorites;
      }

      localStorage.setItem('user', JSON.stringify(this.user));

      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000
      });
    },
    error: () => {
      this.snackBar.open('Failed to remove from favorites', 'OK', {
        duration: 2000
      });
    }
  });
}

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.loadUserProfile();
    }
  }

  updateProfile(): void {
    const storedUsername = this.user.username;

    // ❗ username is not changeable → don't send it in userDetails
    const userDetails: any = {
      email: this.user.email,
      Birthday: this.user.Birthday
    };

    if (this.user.password && this.user.password.trim() !== '') {
      userDetails.password = this.user.password;
    }

    console.log('Token:', localStorage.getItem('token'));
    console.log('Stored username:', storedUsername);
    console.log('Updating with data:', userDetails);

    this.fetchApiData.editUser(storedUsername, userDetails).subscribe({
      next: (result) => {
        console.log('Update successful:', result);

        // Ensure username stays the same
        result.username = storedUsername;

        // Update local storage and reload favorites
        localStorage.setItem('user', JSON.stringify(result));
        this.user = result;
        this.loadFavoriteMovies();

        this.isEditMode = false;
        this.snackBar.open('Profile updated successfully!', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Full error object:', error);
        let errorMessage = 'Failed to update profile';

        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }

        this.snackBar.open(errorMessage, 'OK', {
          duration: 4000
        });
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const username = this.user.username;

      this.fetchApiData.deleteUser(username).subscribe({
        next: () => {
          localStorage.clear();
          this.snackBar.open('Account deleted successfully', 'OK', {
            duration: 2000
          });
          this.router.navigate(['welcome']);
        },
        error: () => {
          this.snackBar.open('Failed to delete account', 'OK', {
            duration: 2000
          });
        }
      });
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open('Logged out successfully', 'OK', {
      duration: 2000
    });
  }
}
