import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

/**
 * The MovieCardComponent displays all movies returned by the API.
 *
 * Responsibilities:
 * - Retrieves a list of movies from the backend
 * - Renders each movie inside an Angular Material card
 * - Provides buttons to display dialogs showing:
 *   - Genre details
 *   - Director details
 *   - Movie synopsis/details
 * - Allows the user to add movies to their list of favorites
 * - Checks whether a movie is already marked as favorite
 *
 * This is a **standalone** component and imports all required Angular
 * and Angular Material modules directly.
 */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  /**
   * An array that holds all movie objects retrieved from the API.
   */
  movies: any[] = [];

  /**
   * Creates the MovieCard component.
   *
   * @param dialog Angular Material dialog service
   * @param snackBar Angular Material snackbar for notifications
   * @param fetchApiData Service handling API communication
   */
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fetchApiData: FetchApiDataService
  ) {}

  /**
   * Lifecycle hook that runs once when the component is initialized.
   * Loads all movies from the API.
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Retrieves the complete list of movies from the backend API.
   * Displays an error message if the request fails.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        console.log('Movies loaded:', movies);
      },
      error: () => {
        this.snackBar.open('Could not load movies', 'OK', {
          duration: 2000
        });
      }
    });
  }

  /**
   * Opens a dialog showing information about a movie's genre.
   *
   * @param movie The movie object whose genre information should be shown
   */
  openGenreDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '500px',
      data: {
        type: 'genre',
        title: movie.genre?.name,
        genre: movie.genre
      }
    });
  }

  /**
   * Opens a dialog showing information about a movie's director.
   *
   * @param movie The movie object whose director info should be shown
   */
  openDirectorDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '500px',
      data: {
        type: 'director',
        title: movie.director?.name,
        director: movie.director
      }
    });
  }

  /**
   * Opens a dialog showing the full movie details (title, description, image).
   *
   * @param movie The movie object containing details to display
   */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '600px',
      data: {
        type: 'movie',
        title: movie.title,
        movie: movie
      }
    });
  }

  /**
   * Adds a movie to the logged-in user's list of favorite movies.
   * Saves the updated user object to localStorage.
   *
   * @param movieId The ID of the movie to add to favorites
   */
  addToFavorites(movieId: string): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.snackBar.open('You need to be logged in to add favorites', 'OK', {
        duration: 2000
      });
      return;
    }

    const userObj = JSON.parse(storedUser);
    const username = userObj.username;

    this.fetchApiData.addFavoriteMovie(username, movieId).subscribe({
      next: () => {
        if (!userObj.favoriteMovies) {
          userObj.favoriteMovies = [];
        }
        if (!userObj.favoriteMovies.includes(movieId)) {
          userObj.favoriteMovies.push(movieId);
        }

        localStorage.setItem('user', JSON.stringify(userObj));

        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000
        });
      },
      error: () => {
        this.snackBar.open('Could not add to favorites', 'OK', {
          duration: 2000
        });
      }
    });
  }

  /**
   * Checks whether a given movie is in the user's favorites list.
   *
   * @param movieId The ID of the movie to check
   * @returns `true` if the movie is already a favorite, otherwise `false`
   */
  isFavorite(movieId: string): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return false;

    const userObj = JSON.parse(storedUser);
    return userObj.favoriteMovies?.includes(movieId) || false;
  }
}
