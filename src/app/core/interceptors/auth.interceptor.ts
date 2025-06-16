import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const currentUser = userService.getCurrentUser();

  if (currentUser) {
    try {
      const { token } = currentUser;
      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Token ${token}`)
        });
        return next(cloned);
      }
    } catch (error) {
      console.error('Error parsing currentUser from localStorage:', error);
    }
  }
  
  return next(req);
}; 