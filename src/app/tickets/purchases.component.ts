import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

// CoreUI Angular (asegúrate de tener instalado @coreui/angular)
import { CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { TableDirective } from '@coreui/angular';

import { TicketsService, TicketConfirmationDTO } from '../core/services/ticket.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  standalone: true,
  imports: [
    NgFor, NgIf, NgClass, DatePipe,
    CardComponent, CardHeaderComponent, CardBodyComponent,
    TableDirective
  ]
})
export class PurchasesComponent implements OnInit {
  purchases: TicketConfirmationDTO[] = [];
  loading = true;

  constructor(private ticketsService: TicketsService) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.ticketsService.getAllTickets().subscribe({
      next: (data) => {
        this.purchases = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando compras', err);
        this.loading = false;
      }
    });
  }
}
