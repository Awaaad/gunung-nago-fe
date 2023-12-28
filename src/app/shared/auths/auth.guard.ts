import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const expectedRole: any[] = route.data['role'];
        const user = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const farmId = localStorage.getItem('farmId');
        let isloggedIn: boolean;

        if (user) {
            isloggedIn = true;
            for (let i = 0; i < expectedRole.length; i++) {
                if (expectedRole[i] === role) {
                    isloggedIn = true;
                    break;
                } else {
                    isloggedIn = false;
                    // this.router.navigateByUrl('/');
                }
            }
        } else {
            isloggedIn = false;
            this.router.navigateByUrl('/security/login');
        }
        return isloggedIn;
    }
}
