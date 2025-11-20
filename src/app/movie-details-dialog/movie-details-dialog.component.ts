/**
 * @component MovieDetailsDialogComponent
 * @description
 * A reusable dialog component that displays detailed information 
 * about a movie, director, or genre.  
 * 
 * This dialog is triggered from the MovieCardComponent and receives
 * data through Angular Material's `MAT_DIALOG_DATA` injection token.
 *
 * @example
 * this.dialog.open(MovieDetailsDialogComponent, {
 *   data: {
 *     type: 'movie',
 *     title: movie.title,
 *     movie: movie
 *   }
 * });
 */

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss']
})
export class MovieDetailsDialogComponent {

  /**
   * @constructor
   * @param data - Injected dialog data (movie, genre, or director info)
   * @param dialogRef - Reference to the open Material dialog,
   *                    allows closing the popup programmatically
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MovieDetailsDialogComponent>
  ) {}

  /**
   * @method closeDialog
   * @description Closes the dialog window.
   * This is triggered when the user clicks the close button.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
