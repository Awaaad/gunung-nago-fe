import { Injectable, Output, EventEmitter } from '@angular/core';
import { AuthenticatedUserDetailsDto, FarmDto } from 'generated-src/model';

@Injectable({
    providedIn: 'root'
})
export class EmitterService {
    @Output() public sessionStateEmitter = new EventEmitter<AuthenticatedUserDetailsDto>();
    @Output() public userDetailsEmitter = new EventEmitter<AuthenticatedUserDetailsDto>();
    @Output() public farmsEmitter = new EventEmitter<FarmDto[]>();

    constructor() { }
}
