import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated() && userService.isAdmin()) {
    return true;
  }
    
  router.navigate(['/auth/login']);
  return false;
}; 