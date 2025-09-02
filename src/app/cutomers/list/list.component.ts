import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../core/services/customers.service';
import { Customer } from '../../core/models/customer.model';
import { ButtonModule, TableModule, CardModule } from '@coreui/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, CardModule],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;

  searchPhone = '';
  searchEmail = '';

  constructor(private customersService: CustomersService) {}

  async ngOnInit(): Promise<void> {
    await this.loadCustomers();
  }

  loadCustomers = async () => {
    this.loading = true;
    try {
      const res = await firstValueFrom(this.customersService.getAll());
      this.customers = res;
    } catch (error) {
      console.error('Error al cargar clientes', error);
    } finally {
      this.loading = false;
    }
  }

  async toggleStatus(customer: Customer): Promise<void> {
    try {
      const updated = await firstValueFrom(
        customer.active
          ? this.customersService.disableUser(customer.id)
          : this.customersService.enableUser(customer.id)
      );
      customer.active = updated.active;
    } catch (err) {
      console.error('Error al actualizar cliente', err);
    }
  }

  async search(): Promise<void> {
    if (!this.searchPhone && !this.searchEmail) {
      await this.loadCustomers();
      return;
    }

    this.loading = true;
    try {
      const res = await firstValueFrom(
        this.customersService.searchUsers(this.searchPhone, this.searchEmail)
      );
      this.customers = res;
    } catch (error) {
      console.error('Error al buscar clientes', error);
    } finally {
      this.loading = false;
    }
  }

    clearFilters() {
      this.searchPhone = '';
      this.searchEmail = '';
      this.loadCustomers();
    }

}
