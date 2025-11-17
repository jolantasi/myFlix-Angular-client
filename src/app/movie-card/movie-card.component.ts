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
  movies: any[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fetchApiData: FetchApiDataService
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

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

  isFavorite(movieId: string): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return false;
    
    const userObj = JSON.parse(storedUser);
    return userObj.favoriteMovies?.includes(movieId) || false;
  }
}