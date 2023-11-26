import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginParamDto } from 'generated-src/model';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { LoginLogoutService } from 'src/app/shared/auths/login.logout.service';
import { EmitterService } from 'src/app/shared/emitters/emitter.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public company = 'C.V gunung nago ';
  formLogin: FormGroup;
  loggedIn: boolean = false;
  submitted = false;

  errorMessages = {
    username: [
      { type: 'required', message: '🔴 Username is required.' },
      { type: 'minlength', message: '🔴 Username must be more than 3 characters.' },
      { type: 'maxlength', message: '🔴 Username must be less than 20 characters.' }
    ],
    password: [
      { type: 'required', message: '🔴 Password is required.' },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private readonly securityApiService: SecurityApiService,
    private readonly router: Router,
    private readonly loginLogoutService: LoginLogoutService,
    private readonly utilService: UtilsService,
    private readonly emitterService: EmitterService
  ) {
    this.formLogin = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit() { }

  public login(): void {
    const loginParam: LoginParamDto = {
      username: this.formLogin.get('username')?.value,
      password: this.formLogin.get('password')?.value,
      farmId: 1
    }
    if (loginParam.username === 'enggi') {
      loginParam.farmId = 2
    }
    this.submitted = true;
    if (this.formLogin.invalid) {
      this.utilService.unsuccessMsg('Invalid Username or Password', 'danger');
    } else {
      this.loggedIn = true;
      this.securityApiService.authenticateUser(loginParam).subscribe(data => {
        {
          localStorage.setItem('id', JSON.stringify(data.userDto.id));
          localStorage.setItem('username', data.userDto.username);
          localStorage.setItem('cashier', data.userDto.firstName);
          localStorage.setItem('role', data.userDto.roles[0].role);
          localStorage.setItem('token', data.token);
          if (data.userDto.username === 'enggi') {
            const user = {
              username: data.userDto.username,
              role: ['ADMIN'],
              farmId: 2
            }
            this.loginLogoutService.loginUser(user);
          } else {
            const user = {
              username: data.userDto.username,
              role: ['ADMIN'],
              farmId: 1
            }
            this.loginLogoutService.loginUser(user);
          }

          if (localStorage.getItem('role') === 'ADMIN') {
            this.router.navigateByUrl('/home');
          } else if (localStorage.getItem('role') === 'CASHIER') {
            this.router.navigateByUrl(`/point-of-sale/pos/${data.userDto.firstName}/${data.userDto.roles[0].role}`);
          }
        }
      }, error => {
        localStorage.clear();
        this.utilService.unsuccessMsg('Invalid Username or Password', 'danger');
      }
      );
    }
  }
}
