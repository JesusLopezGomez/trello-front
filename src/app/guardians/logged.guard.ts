import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const loggedGuard: CanMatchFn = (route, segments) => {
  const serviceUser = inject(UserService);
  const router = inject(Router);
  
  return serviceUser.role() !== "admin" && serviceUser.role() !== "user" ? router.navigateByUrl("/login") : true;
};
