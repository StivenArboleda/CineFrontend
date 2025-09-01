import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MoviesService } from '../../core/services/movies.service';
import { AuthService } from '../../core/services/auth.service';
import { PurchaseService } from '../../core/services/purchase.service'; 
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';
import { CardBodyComponent, CardComponent, CardFooterComponent, ModalModule, WidgetStatDComponent } from '@coreui/angular';

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
    WidgetStatDComponent]
})
export class MoviesClientComponent implements OnInit {
  movies: Movie[] = [];
  showPurchaseModal = false;
  selectedMovie: Movie | null = null;
  purchaseForm!: FormGroup;

  searchTitle: string = '';
  searchCategory: string = '';

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadMovies();
    this.initForm();
  }

  loadMovies(): void {
    this.moviesService.getMoviesActive().subscribe((data: Movie[]) => {
      this.movies = data;
    });
  }


  initForm() {
    this.purchaseForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      card: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      code: ['', Validators.required]
    });
  }

  openPurchaseModal(movie: Movie) {
    this.selectedMovie = movie;
    this.showPurchaseModal = true;
  }

  onPurchase() {
    if (!this.selectedMovie) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const payload = {
      customerId: currentUser.id, 
      movieId: this.selectedMovie.id,
      quantity: this.purchaseForm.value.quantity,
      paymentInfo: {
        card: this.purchaseForm.value.card,
        month: this.purchaseForm.value.month,
        year: this.purchaseForm.value.year,
        code: this.purchaseForm.value.code,
      }
    };

    this.purchaseService.createPurchase(payload).subscribe({
      next: () => {
        alert('Compra realizada con éxito');
        this.showPurchaseModal = false;
        this.purchaseForm.reset({ quantity: 1 });
      },
      error: (err) => {
        console.error(err);
        alert('Error al realizar la compra');
      }
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
}
