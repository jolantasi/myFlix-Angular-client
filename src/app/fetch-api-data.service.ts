// src/app/fetch-api-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // ⬇️ change this to your actual myFlix API URL
  private apiUrl = 'https://myflix-movieapi.onrender.com/';

  constructor(private http: HttpClient) {}

  // Build headers with JWT token from localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* ========= AUTH & USER ========= */

  // Register
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Login
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get user by username
  public getUser(username: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'users/' + username, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  // Edit user
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(this.apiUrl + 'users/' + username, userDetails, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  // Delete user (used in your deleteAccount())
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(this.apiUrl + 'users/' + username, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  /* ========= MOVIES ========= */

  public getAllMovies(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl + 'movies', {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies/' + title, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  public getDirector(name: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies/directors/' + name, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  public getGenre(name: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'movies/genres/' + name, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
  return this.http
    .post(
      this.apiUrl + `users/${username}/movies/${movieId}`,
      {},
      { headers: this.getAuthHeaders() }
    )
    .pipe(catchError(this.handleError));
}

public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
  return this.http
    .delete(this.apiUrl + `users/${username}/movies/${movieId}`, {
      headers: this.getAuthHeaders()
    })
    .pipe(catchError(this.handleError));
}

// 👇 add this alias to satisfy your component
public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
  return this.deleteFavoriteMovie(username, movieId);
}

  /* ========= ERROR HANDLER ========= */

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
