import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieCardComponent } from './movie-card/movie-card.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';

const routes: Routes = [
  { path: '', component: UserLoginFormComponent },        // welcome / login
  { path: 'movies', component: MovieCardComponent },      // movie cards
  { path: 'register', component: UserRegistrationFormComponent }, // registration
  { path: '**', redirectTo: '' }                          // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
