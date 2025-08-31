import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private apiUrl = 'http://localhost:8080/api/tickets/purchase'; 

  constructor(private http: HttpClient) {}

  createPurchase(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
