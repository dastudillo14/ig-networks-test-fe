import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, ButtonModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4">
          <p-menubar [model]="menuItems" styleClass="border-none"></p-menubar>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-50">
        <div class="container mx-auto px-4 py-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t">
        <div class="container mx-auto px-4 py-6">
          <p class="text-center text-gray-600">© {{ year }} IG-JAP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {

  userService = inject(UserService);

  titleApplications = this.userService.isAdmin() ? 'Applications' : 'My Applications';

  year = new Date().getFullYear();
  
  menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/jobs'
    },
    {
      label: 'Jobs',
      icon: 'pi pi-briefcase',
      routerLink: '/jobs/admin',
      visible: this.userService.isAdmin()
    },
    {
      label: this.titleApplications,
      icon: 'pi pi-file-edit',
      visible: this.userService.isAuthenticated(),
      routerLink: '/applications'
    },
    {
      label:'Login',
      icon: 'pi pi-sign-in',
      routerLink: '/auth/login',
      visible: !this.userService.isAuthenticated()
    },
    {
      label:'Register',
      icon: 'pi pi-user-plus',
      routerLink: '/auth/register',
      visible: !this.userService.isAuthenticated()
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      routerLink: '/jobs',
      command: () => this.userService.logout(),
      visible: this.userService.isAuthenticated()
    }
  ];
} 