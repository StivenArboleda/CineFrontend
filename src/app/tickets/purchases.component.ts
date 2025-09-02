import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

// CoreUI Angular (asegúrate de tener instalado @coreui/angular)
import { CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { TableDirective } from '@coreui/angular';

import { TicketsService, TicketConfirmationDTO } from '../core/services/ticket.service';
import { firstValueFrom } from 'rxjs';

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

  async ngOnInit(): Promise<void> {
    await this.loadPurchases();
  }

   loadPurchases = async (): Promise<void> => {
    try {
      const data = await firstValueFrom(this.ticketsService.getAllTickets());
      console.log('Compras cargadas', data);
      this.purchases = data;
    } catch (error) {
      console.error('Error cargando compras', error);
    } finally {
      this.loading = false;
    }
  }
}
