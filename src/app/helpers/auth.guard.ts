import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { TokenStorageService } from '../security/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private tokenStorageService: TokenStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.tokenStorageService.getUser();
        if (currentUser && Object.keys(currentUser).includes('role')) {
            if (route.data.role && route.data.role.indexOf(currentUser.role) === -1) {
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }
        else{
            this.router.navigate(['/']);
            return false;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}