import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Base URL of your API
const apiUrl = 'https://myflix-movieapi.onrender.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  private apiUrl = 'https://myflix-movieapi.onrender.com';
  constructor(private http: HttpClient) {}

  // ======= User endpoints =======

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User login
  public userLogin(credentials: any): Observable<any> {
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  // Get user
  public getUser(username: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + username, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Edit user
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + 'users/' + username, userDetails, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + username, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // ======= Movie endpoints =======

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Get one movie
  public getMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/' + title, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Get director
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/directors/' + directorName, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Get genre
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/genres/' + genreName, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // ======= Favorites =======

  // Get favorite movies for a user
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + username + '/movies', this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Add a movie to favorite movies
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {}, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a movie from the favorite movies
  public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // ======= Helpers =======

  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // token should be saved at login
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}