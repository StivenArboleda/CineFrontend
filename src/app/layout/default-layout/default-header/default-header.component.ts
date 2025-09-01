import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CustomersService } from '../../../core/services/customers.service';
import {
  HeaderComponent,
  HeaderNavComponent,
  ContainerComponent,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownHeaderDirective,
  DropdownDividerDirective,
  AvatarComponent,
  ButtonDirective,
  HeaderTogglerDirective,
  SidebarToggleDirective,
  NavItemComponent,
  NavLinkDirective,
  BreadcrumbRouterComponent,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    HeaderComponent,
    HeaderNavComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownHeaderDirective,
    DropdownDividerDirective,
    AvatarComponent,
    ButtonDirective,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    NavItemComponent,
    NavLinkDirective,
    BreadcrumbRouterComponent,
    BadgeComponent,
    IconDirective
  ]
})
export class DefaultHeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private customersService = inject(CustomersService);
  private router = inject(Router);

  public sidebarId = 'sidebar1';

  public currentUser: any;

ngOnInit(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.customersService.getCustomerById(userId).subscribe({
        next: (customer) => {
          this.currentUser = customer; // ahora tiene nombre, apellido, email, etc.
        },
        error: (err) => {
          console.error('No se pudo obtener info del usuario', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
