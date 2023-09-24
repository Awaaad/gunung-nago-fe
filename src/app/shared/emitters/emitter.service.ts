import { Injectable, Output, EventEmitter } from '@angular/core';
import { AuthenticatedUserDetailsDto } from 'generated-src/model';

@Injectable({
    providedIn: 'root'
})
export class EmitterService {
    @Output() public sessionStateEmitter = new EventEmitter<AuthenticatedUserDetailsDto>();
    @Output() public userDetailsEmitter = new EventEmitter<AuthenticatedUserDetailsDto>();

    constructor() { }
}
