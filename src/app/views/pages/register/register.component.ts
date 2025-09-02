import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomersService } from '../../../core/services/customers.service';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ButtonDirective,
    IconDirective
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private customersService: CustomersService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.submitting = true;

    this.customersService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: "Registro realizado con éxito",
          icon: "success",
          draggable: true
        });
        this.registerForm.reset();
        this.submitting = false;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Error al registrar', err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.error || 'Error al registrar la cuenta'
        });
        this.submitting = false;
      }
    });
  }
}
