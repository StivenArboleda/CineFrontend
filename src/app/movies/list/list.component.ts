import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetStatDComponent } from '@coreui/angular';
import { MoviesService, Movie } from '../../core/services/movies.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, CardComponent, CardBodyComponent, CardFooterComponent } from '@coreui/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    CardComponent,
    CardBodyComponent,
    CardFooterComponent,
    WidgetStatDComponent
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']   
})
export class ListComponent implements OnInit {

  movieForm!: FormGroup;
  updateForm!: FormGroup;

  movies: Movie[] = [];
  showCreateModal = false;
  showUpdateModal = false;

  selectedFile: File | null = null;
  selectedUpdateFile: File | null = null;

  searchTitle: string = '';
  searchCategory: string = '';

  movieToUpdate: Movie | null = null;

  constructor(private moviesService: MoviesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadMovies();

    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', Validators.required],
      capacity: [100, Validators.required],
      active: [true]
    });

    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', Validators.required],
      capacity: [100, Validators.required],
      active: [true]
    });
  }

  loadMovies(): void {
    this.moviesService.getMovies().subscribe((data: Movie[]) => {
      this.movies = data;
    });
  }

  toggleMovie(movie: Movie): void {
    const toggle$ = movie.active
      ? this.moviesService.disableMovie(movie.id)
      : this.moviesService.enableMovie(movie.id);

    toggle$.subscribe({
      next: (updated) => {
        movie.active = updated.active;
      },
      error: (err) => console.error('Error al actualizar película', err)
    });
  }

  onFileSelected(event: Event, isUpdate: boolean = false): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (isUpdate) {
        this.selectedUpdateFile = file;
      } else {
        this.selectedFile = file;
      }
    }
  }

  onSubmit(): void {
    if (this.movieForm.invalid || !this.selectedFile) return;

    const movieData = this.movieForm.value;
    this.moviesService.createMovie(movieData, this.selectedFile).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.movieForm.reset({ active: true, capacity: 100 });
        this.loadMovies(); // recarga lista
      },
      error: (err) => console.error('Error al crear película', err)
    });
  }

  search(): void {
    this.moviesService.searchMovies(this.searchTitle, this.searchCategory)
      .subscribe((data) => {
        this.movies = data;
      });
  }

  resetFilters(): void {
    this.searchTitle = '';
    this.searchCategory = '';
    this.loadMovies();
  }

    openUpdateModal(movie: Movie): void {
    this.movieToUpdate = movie;
    this.updateForm.patchValue(movie);
    this.showUpdateModal = true;
  }

  onUpdate(): void {
    if (!this.movieToUpdate) return;

    const movieData = this.updateForm.value;
    this.moviesService.updateMovie(this.movieToUpdate.id, movieData, this.selectedUpdateFile)
      .subscribe({
        next: () => {
          this.showUpdateModal = false;
          this.selectedUpdateFile = null;
          this.loadMovies();
        },
        error: (err) => console.error('Error al actualizar película', err)
      });
  }

}
