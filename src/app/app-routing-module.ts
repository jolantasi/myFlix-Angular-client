import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieCardComponent } from './movie-card/movie-card.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';

/**
 * Defines application-wide routes for the Angular client.
 *
 * Responsibilities:
 * - Maps URL paths to standalone components
 * - Handles navigation between login, registration, and movie views
 * - Redirects unrecognized paths to the default route
 *
 * Routes configured:
 * - `/` → Login form
 * - `/movies` → Movie overview
 * - `/register` → Registration form
 * - `/**` → Wildcard redirect to `/`
 */
const routes: Routes = [
  /**
   * Default route: displays the login form.
   */
  { path: '', component: UserLoginFormComponent },

  /**
   * Shows a list of movies, accessible after successful login.
   */
  { path: 'movies', component: MovieCardComponent },

  /**
   * Displays the user registration form.
   */
  { path: 'register', component: UserRegistrationFormComponent },

  /**
   * Fallback route: redirects unknown URLs back to the login page.
   */
  { path: '**', redirectTo: '' }
];

/**
 * AppRoutingModule initializes Angular’s router with the defined routes
 * and makes routing available to the entire application.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
