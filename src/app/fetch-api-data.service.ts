// src/app/fetch-api-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Service responsible for all communication with the myFlix API.
 *
 * It provides methods for:
 * - registering and logging in users
 * - retrieving user data
 * - updating and deleting user accounts
 * - fetching movies, directors, and genres
 * - managing favorite movies
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
   * Base URL of the myFlix API.
   * Change this if your backend URL changes.
   */
  private apiUrl = 'https://myflix-movieapi.onrender.com/';

  /**
   * Creates an instance of FetchApiDataService.
   *
   * @param http Angular HttpClient used to perform HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Builds HTTP headers including the JWT token from localStorage.
   *
   * @returns HttpHeaders containing an Authorization header with Bearer token.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* ========= AUTH & USER ========= */

  /**
   * Registers a new user with the API.
   *
   * @param userDetails Object containing user registration data
   * (e.g., username, password, email, birthday).
   * @returns Observable with the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs an existing user into the application.
   *
   * @param userDetails Object containing login credentials
   * (e.g., username and password).
   * @returns Observable with the API response (usually including a JWT token).
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves user data for the specified username.
   *
   * @param username The username whose data should be fetched.
   * @returns Observable with the user data.
   */
  public getUser(username: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'users/' + username, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates a user's account information.
   *
   * @param username The username of the account to update.
   * @param userDetails Object containing updated user properties.
   * @returns Observable with the updated user data.
   */
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(this.apiUrl + 'users/' + username, userDetails, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user account.
   *
   * This method is used in your `deleteAccount()` flow on the client.
   *
   * @param username The username of the account to delete.
   * @returns Observable with the API response.
   */
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(this.apiUrl + 'users/' + username, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /* ========= MOVIES ========= */

  /**
   * Retrieves all movies from the API.
   *
   * @returns Observable with an array of movie objects.
   */
  public getAllMovies(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl + 'movies', {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single movie by its title.
   *
   * @param title The title of the movie to retrieve.
   * @returns Observable with the movie object.
   */
  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies/' + title, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves information about a director.
   *
   * @param name Name of the director.
   * @returns Observable with the director details.
   */
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies/directors/' + name, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves information about a movie genre.
   *
   * @param name Name of the genre.
   * @returns Observable with the genre details.
   */
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies/genres/' + name, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds a movie to the user's list of favorite movies.
   *
   * @param username The username whose favorites list should be updated.
   * @param movieId The ID of the movie to add.
   * @returns Observable with the updated user data or API response.
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(
        this.apiUrl + `users/${username}/movies/${movieId}`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   *
   * @param username The username whose favorites list should be updated.
   * @param movieId The ID of the movie to remove.
   * @returns Observable with the updated user data or API response.
   */
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(this.apiUrl + `users/${username}/movies/${movieId}`, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Alias for {@link deleteFavoriteMovie} to match component expectations.
   *
   * Some components call `removeFavoriteMovie`, so this method simply
   * delegates to `deleteFavoriteMovie`.
   *
   * @param username The username whose favorites list should be updated.
   * @param movieId The ID of the movie to remove.
   * @returns Observable with the updated user data or API response.
   */
  public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.deleteFavoriteMovie(username, movieId);
  }

  /* ========= ERROR HANDLER ========= */

  /**
   * Handles HTTP errors from the API.
   *
   * @param error Error object returned by HttpClient.
   * @returns Observable that errors with the original error object.
   */
  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
