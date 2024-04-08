import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateChildFn | CanActivateFn = (route, state) => {
  return inject(AuthService).isAuthenticated();
}
