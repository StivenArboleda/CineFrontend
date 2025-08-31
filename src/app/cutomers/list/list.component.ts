import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersService, Customer } from '../../core/services/customers.service';
import { ButtonModule, TableModule, CardModule } from '@coreui/angular';

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

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customersService.getAll().subscribe({
      next: (res) => {
        this.customers = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  toggleStatus(customer: Customer): void {
    const toggle$ = customer.active
      ? this.customersService.disableUser(customer.id)
      : this.customersService.enableUser(customer.id);

    toggle$.subscribe({
      next: (updated) => {
        customer.active = updated.active; // actualiza la tabla
      },
      error: (err) => console.error('Error al actualizar cliente', err)
    });
  }


  search() {
    if (!this.searchPhone && !this.searchEmail) {
      this.loadCustomers();
      return;
    }

    this.loading = true;
    this.customersService
      .searchUsers(this.searchPhone, this.searchEmail)
      .subscribe({
        next: (res) => {
          this.customers = res;
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
  }

    clearFilters() {
      this.searchPhone = '';
      this.searchEmail = '';
      this.loadCustomers();
    }

}
