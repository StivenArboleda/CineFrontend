import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MoviesService } from '../../core/services/movies.service';
import { AuthService } from '../../core/services/auth.service';
import { PurchaseService } from '../../core/services/purchase.service'; 
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';
import { CardBodyComponent, CardComponent, CardFooterComponent, ModalModule, WidgetStatDComponent } from '@coreui/angular';
import { firstValueFrom } from 'rxjs';
import { AlertComponent } from '@coreui/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movies-client',
  templateUrl: './movies-client.component.html',
  styleUrls: ['./movies-client.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    CardComponent,
    CardBodyComponent,
    CardFooterComponent,
    WidgetStatDComponent,
    AlertComponent
  ]
})
export class MoviesClientComponent implements OnInit {
  movies: Movie[] = [];
  moviesFiltered: Movie[] = [];
  showPurchaseModal = false;
  selectedMovie: Movie | null = null;
  purchaseForm!: FormGroup;
  searchTitle = '';
  searchCategory = '';
  loading = false;

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private fb: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadMovies();
    this.initForm();
  }

  async loadMovies(): Promise<void> {
    this.loading = true;
    try {
      this.movies = await firstValueFrom(this.moviesService.getMoviesActive());
      this.moviesFiltered = [...this.movies];
    } catch (error) {
      this.handleError('Error al cargar películas', error);
    } finally {
      this.loading = false;
    }
  }

  async initForm(): Promise<void> {
    this.purchaseForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      card: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(14),
          Validators.pattern('^[0-9]*$')
        ]
      ],
      month: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])$')
        ]
      ],
      year: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{4}$')
        ]
      ],
      code: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{3,4}$')
        ]
      ]
    });
  }

  openPurchaseModal(movie: Movie): void {
    this.selectedMovie = movie;
    this.showPurchaseModal = true;
  }

  async onPurchase(): Promise<void> {
    this.purchaseForm.get('quantity');
    console.log(this.purchaseForm.get('quantity'));
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      console.warn('Formulario inválido:', this.purchaseForm.errors, this.purchaseForm);
      return;
    }

    const payload = {
      customerId: this.authService.getCurrentUser()?.id,
      movieId: this.selectedMovie!.id,
      quantity: Number(this.purchaseForm.value.quantity), 
      paymentInfo: {
        card: this.purchaseForm.value.card,
        month: this.purchaseForm.value.month,
        year: this.purchaseForm.value.year,
        code: this.purchaseForm.value.code
      }
    };

    await this.purchaseService.createPurchase(payload).subscribe({
      next: async () => {
        Swal.fire({
          title: "Compra realizada con éxito",
          icon: "success",
          draggable: true
        });
        this.closePurchaseModal();
        await this.ngOnInit();
      },
      error: async (err) => {
        console.log(err.error.error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.error || 'Error al procesar la compra'
        });
      }
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

  closePurchaseModal(): void {
    this.showPurchaseModal = false;
    this.selectedMovie = null;
    this.purchaseForm.reset();
    this.loading = false;
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    alert(message);
    this.loading = false;
  }

}