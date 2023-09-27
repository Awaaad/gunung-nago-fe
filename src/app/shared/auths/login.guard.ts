import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(
        private router: Router
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const expectedRole: any[] = route.data['role'];
        const user = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const farmId = localStorage.getItem('farmId');

        if (user) {
            if (role === 'ADMIN') {
                this.router.navigateByUrl('/home');
            } else if (role === 'CASHIER') {
                this.router.navigateByUrl(`/point-of-sale/pos`);
            }
            return false;
        } else {
            return true;
        }
    }
}
