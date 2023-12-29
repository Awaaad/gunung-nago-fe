import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EmitterService } from '../emitters/emitter.service';
import { AuthenticatedUserDetailsDto } from 'generated-src/model';

@Injectable({
    providedIn: 'root'
})
export class LoginLogoutService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private emitterService: EmitterService) {
    }

    loginUser(user: AuthenticatedUserDetailsDto) {
        if (user.username) {
            this.emitterService.sessionStateEmitter.emit(user);
        }
    }

    logoutUser() {
        const user = {
            username: '',
            role: [],
            farmId: 0
        }
        localStorage.clear();
        this.emitterService.sessionStateEmitter.emit(user);
        this.router.navigate(['security/login']);
    }
}
