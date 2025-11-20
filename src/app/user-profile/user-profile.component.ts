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

/**
 * @component UserProfileComponent
 * @description
 * Displays and manages the profile of the currently logged-in user.
 *
 * Responsibilities:
 * - Load user data from `localStorage` and backend
 * - Display and edit profile information (email, birthday, password)
 * - Show and manage favorite movies
 * - Allow removing favorite movies
 * - Allow deleting the user account
 * - Provide logout functionality
 *
 * This is a **standalone** component that imports all required Angular
 * and Angular Material modules directly.
 */
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
  /**
   * Holds the current user object.
   * Loaded from `localStorage` and updated after profile changes.
   */
  user: any = {};

  /**
   * Flag to toggle between view mode and edit mode in the template.
   */
  isEditMode: boolean = false;

  /**
   * Stores the original username returned by the backend.
   * Used to ensure that the username does not accidentally change.
   */
  originalUsername: string = '';

  /**
   * An array of movie objects representing the user's favorite movies.
   * Resolved from the list of favorite movie IDs stored on the user.
   */
  favoriteMovies: any[] = [];

  /**
   * Creates the UserProfileComponent.
   *
   * @param fetchApiData Service for API communication (user + movies)
   * @param snackBar Angular Material snackbar for user notifications
   * @param router Angular router for navigation
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook.
   * Called once, after the component has been initialized.
   * Loads the user profile and their favorite movies.
   */
  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Loads the user profile data from `localStorage`.
   * If no user is found, redirects to the welcome page.
   *
   * Also:
   * - Sets the `originalUsername` from the stored user
   * - Triggers loading of favorite movies based on stored favorite IDs
   */
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

  /**
   * Loads all movies from the API and filters them down to the user's
   * favorite movies, based on IDs stored on the user object.
   *
   * Supports both:
   * - `FavoriteMovies` (backend-style)
   * - `favoriteMovies` (client-style)
   */
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

  /**
   * Removes a movie from the user's list of favorites.
   *
   * Steps:
   * - Calls the API to remove the movie from favorites
   * - Updates the `favoriteMovies` array
   * - Updates the user’s favorites in `localStorage`
   * - Shows a snackbar message on success or error
   *
   * @param movieId The ID of the movie to remove from favorites
   */
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

  /**
   * Toggles edit mode for the profile form.
   * When turning edit mode off, the profile is reloaded from storage.
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.loadUserProfile();
    }
  }

  /**
   * Updates the user's profile information (email, birthday, and optionally password).
   *
   * Notes:
   * - The username is treated as immutable and never changed here
   * - After a successful update, the local user object and `localStorage`
   *   are updated and favorite movies are reloaded
   */
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

  /**
   * Deletes the user's account after confirmation.
   *
   * Steps:
   * - Asks the user to confirm deletion
   * - Calls the API to delete the user
   * - Clears `localStorage`
   * - Navigates back to the welcome page
   *
   * Shows a snackbar on success or error.
   */
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

  /**
   * Logs out the current user.
   *
   * Steps:
   * - Clears all data from `localStorage`
   * - Navigates to the welcome page
   * - Shows a snackbar confirming logout
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open('Logged out successfully', 'OK', {
      duration: 2000
    });
  }
}
