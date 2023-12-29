import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from './shared/utils/utils.service';
import { FarmDto, LoginParamDto } from 'generated-src/model';
import { SecurityApiService } from './shared/apis/security.api.service';
import { LoginLogoutService } from './shared/auths/login.logout.service';
import { Router } from '@angular/router';
import { EmitterService } from './shared/emitters/emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public username!: string | undefined;
  public farmId!: number | undefined;
  public farms: FarmDto[] = [];
  public password!: string;
  public language = 'en';
  public languages = [{ name: 'English', code: 'en' }, { name: 'Indonesian', code: 'id' }]
  public sessionSubscription!: Subscription;
  public farmsSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private utilsService: UtilsService,
    private readonly router: Router,
    private readonly emittersService: EmitterService,
    private readonly securityApiService: SecurityApiService,
    private readonly loginLogoutService: LoginLogoutService) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.username = utilsService.toTitleCase(localStorage.getItem('username'));
    const farm: FarmDto[] | any = localStorage.getItem('farm');
    this.farms = JSON.parse(farm);
    const farmId: any = localStorage.getItem('farmId');
    this.farmId = JSON.parse(farmId);

    this.sessionSubscription = this.emittersService.sessionStateEmitter.subscribe((data: any) => {
      if (data.username) {
        this.username = utilsService.toTitleCase(data.username);
      } else {
        this.username = "";
        this.farms = [];
      }
    });

    this.farmsSubscription = this.emittersService.farmsEmitter.subscribe((data: any) => {
      if (data) {
        this.farms = data;
      } else {
        this.farms = [];
      }
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  public selectLanguage(event: any): void {
    this.translate.use(event.detail.value);
  }

  public selectFarm(event: any) {
    this.login(event.detail.value);
  }

  public login(farmId: number): void {
    const user: any = localStorage.getItem('username');
    const loginParam: LoginParamDto = {
      username: user,
      password: this.password,
      farmId: farmId
    }
    this.securityApiService.authenticateUser(loginParam).subscribe(data => {
      {
        localStorage.setItem('id', JSON.stringify(data.userDto.id));
        localStorage.setItem('farmId', JSON.stringify(farmId));
        localStorage.setItem('username', data.userDto.username);
        localStorage.setItem('role', JSON.stringify(data.userDto.roles.map(role => role.role)));
        localStorage.setItem('farm', JSON.stringify(data.userDto.farms));
        localStorage.setItem('token', data.token);
        const user = {
          username: data.userDto.username,
          role: data.userDto.roles.map(role => role.role),
          farmId: farmId
        }
        this.loginLogoutService.loginUser(user);

        const roles: any = localStorage.getItem('role');
        if (JSON.parse(roles).includes('ADMIN')) {
          this.router.navigateByUrl('/home');
        } else if (localStorage.getItem('role') === 'CASHIER') {
          this.router.navigateByUrl(`/point-of-sale/pos/${data.userDto.firstName}/${data.userDto.roles[0].role}`);
        }
      }
    }, error => {
      localStorage.clear();
      this.utilsService.unsuccessMsg('Invalid Username or Password', 'danger');
    });
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
    this.farmsSubscription.unsubscribe();
  }
}
