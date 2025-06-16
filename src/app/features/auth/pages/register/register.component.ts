import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../core/services/user.service';
import { ProfileEnum } from '../../../../core/enums/profile.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    ToastModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  messageService = inject(MessageService);
  router = inject(Router);

  formGroup!: FormGroup;
  loading = false;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.userService.register(this.formGroup.value).subscribe({
      next: (user) => {
        this.router.navigate(['/jobs']);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully', life: 3000 });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.error ?? 'Error registering user', life: 3000 });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
} 