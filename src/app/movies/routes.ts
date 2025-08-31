import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    title: 'Movies'
  },
  {
    path: ':id',
    component: DetailComponent,
    title: 'Movie Details'
  }
];
