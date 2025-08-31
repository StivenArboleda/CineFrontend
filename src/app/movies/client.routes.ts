import { Routes } from '@angular/router';
import { MoviesClientComponent } from './customerMovie/movies-client.component';

export const routes: Routes = [
  {
    path: '',
    component: MoviesClientComponent,
    title: 'Movies Shop'
  }
];
