import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmitterService } from '../emitters/emitter.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private toastCtrl: ToastController,
        private router: Router,
        private emitterService: EmitterService) {
    }

    async unsuccessMsg() {
        const toast = await this.toastCtrl.create({
          message: 'Invalid Username or Password',
          position: 'top',
          color: 'danger',
          duration: 2000,
          cssClass: 'toast-custom'
        });
        toast.present();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = window.localStorage.getItem('token');

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }

        return next.handle(request).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401 || err.status === 403) {
                        this.unsuccessMsg();
                        setTimeout(() => {
                            const user = {
                                username: 'loggedOut',
                                role: [],
                                farmId: 0
                            }
                            this.emitterService.sessionStateEmitter.emit(user);
                            localStorage.clear();
                            this.router.navigateByUrl('/login');
                        }, 2000);
                    }
                }
                return throwError(err);
            }));
    }
}
