import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  category: string;
  year: number;
  description: string;
  active: boolean;
  capacity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = 'http://localhost:8080/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  createMovie(movie: any, image: File): Observable<Movie> {
  const formData = new FormData();
  formData.append('movie', JSON.stringify(movie));
  formData.append('image', image);

  return this.http.post<Movie>(`${this.apiUrl}`, formData);
  }

  searchMovies(title?: string, category?: string): Observable<Movie[]> {
    let params = new HttpParams();
    if (title) params = params.set('title', title);
    if (category) params = params.set('category', category);

    return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params });
  }

updateMovie(id: number, movie: any, file?: File | null): Observable<Movie> {
  const formData = new FormData();
  formData.append('movie', JSON.stringify(movie));
  if (file) {
    formData.append('image', file);
  }
  return this.http.put<Movie>(`${this.apiUrl}/${id}`, formData);
}


  disableMovie(id: number): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/disable/${id}`, {});
  }

  enableMovie(id: number): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/enable/${id}`, {});
  }
}
