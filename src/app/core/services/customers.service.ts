import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/customers';

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  searchUsers(phone?: string, email?: string): Observable<Customer[]> {
    let params = new HttpParams();
    if (phone) params = params.set('phone', phone);
    if (email) params = params.set('email', email);

    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { params });
  }

enableUser(id: number): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/enable/${id}`, {});
  }

  disableUser(id: number): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/disable/${id}`, {});
  }

  toggleStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, { active: !active });
  }
}
