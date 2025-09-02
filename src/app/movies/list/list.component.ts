import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetStatDComponent } from '@coreui/angular';
import { MoviesService } from '../../core/services/movies.service';
import { Movie } from '../../core/models/movie.model';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, CardComponent, CardBodyComponent, CardFooterComponent } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';


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
  moviesFiltered: Movie[] = [];
  showCreateModal = false;
  showUpdateModal = false;

  selectedFile: File | null = null;
  selectedUpdateFile: File | null = null;

  searchTitle: string = '';
  searchCategory: string = '';

  movieToUpdate: Movie | null = null;

  constructor(private moviesService: MoviesService, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {

    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900)]],
      description: ['', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]],
      active: [true],
      image: [null, Validators.required],
    });

    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900)]],
      description: ['', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]],
      active: [true],
      image: [null],
    });

    await this.loadMovies();
  }


  loadMovies = async () => {
    try {
      const data = await firstValueFrom(this.moviesService.getMovies());
      this.movies = data;
      this.moviesFiltered = data;
    } catch (error) {
      console.error('Error al cargar películas', error);
    }
  }

  async toggleMovie(movie: Movie): Promise<void> {
    try {
      const updated = await firstValueFrom(
        movie.active
          ? this.moviesService.disableMovie(movie.id)
          : this.moviesService.enableMovie(movie.id)
      );
      movie.active = updated.active;
    } catch (err) {
      console.error('Error al actualizar película', err);
    }
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
        this.loadMovies(); 
      },
      error: (err) => console.error('Error al crear película', err)
    });
  }

  async filterMovies(title: string, category: string): Promise<void> {
    try {
      this.moviesFiltered = this.movies.filter(movie =>
        movie.title.toLowerCase().includes(title.toLowerCase()) &&
        movie.category.toLowerCase().includes(category.toLowerCase())
      );
    } catch (error) {
      console.error('Error al filtrar películas', error);
    }
  }

  resetFilters(): void {
    this.searchTitle = '';
    this.searchCategory = '';
    this.loadMovies();
  }

  async openUpdateModal(movie: Movie): Promise<void> {
    this.movieToUpdate = movie;
    this.updateForm.patchValue(movie);
    this.showUpdateModal = true;
  }
  async onUpdate(): Promise<void> {
    if (!this.movieToUpdate || this.updateForm.invalid) return;

    const movieData = this.updateForm.value;
    this.moviesService.updateMovie(this.movieToUpdate.id, movieData, this.selectedUpdateFile)
      .subscribe({
        next: async () => {
          await this.loadMovies();
          this.showUpdateModal = false;
          this.selectedUpdateFile = null;
          this.updateForm.reset();
          this.movieToUpdate = null;
        },
        error: (err) => console.error('Error al actualizar película', err)
      });
  }

  showCreateMovieModal(): void {
    this.showCreateModal = true;
  }

  hideCreateMovieModal(): void {
    this.showCreateModal = false;
  }

  validateForm(): void {
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      console.warn('Formulario inválido:', this.movieForm.errors, this.movieForm);
      return;
    }

    console.log('Formulario válido:', this.movieForm.value);
  }
}
