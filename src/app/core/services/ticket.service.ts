import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketConfirmationDTO {
  movieTitle: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: string;
  purchaseDate: string;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<TicketConfirmationDTO[]> {
    return this.http.get<TicketConfirmationDTO[]>(this.apiUrl);
  }
}
