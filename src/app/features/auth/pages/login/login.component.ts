import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { ProfileEnum } from '../../../../core/enums/profile.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ToastModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
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
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.userService.login(this.formGroup.value).subscribe({
      next: (login) => {
        // Check if there's a saved redirect URL
        const redirectUrl = localStorage.getItem('redirectUrl');
        
        if (redirectUrl && login.user.groups.includes(ProfileEnum.APPLICANT)) {
          // Clear the saved URL and redirect
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        } else {
          // Normal flow based on user role
          if (login.user.groups.includes(ProfileEnum.ADMIN)) {
            this.router.navigate(['/applications']);
          } else if (login.user.groups.includes(ProfileEnum.APPLICANT)) {
            this.router.navigate(['/jobs']);
          }
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 3000 });
      },
      error: (error) => {
        console.error('Login failed', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.error ?? 'User or password incorrect.', life: 3000 });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
} 