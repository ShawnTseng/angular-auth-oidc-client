import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userData;

  userInfo;

  token = '';

  tokenExpire = true;

  constructor(public oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.getIsModuleSetup().pipe(
      filter((isModuleSetup: boolean) => isModuleSetup),
      take(1)
    ).subscribe((isModuleSetup: boolean) => {
      this.doCallbackLogicIfRequired();
    });
  }

  login() {
    // if you need to add extra parameters to the login
    // let culture = 'de-CH';
    // this.oidcSecurityService.setCustomRequestParameters({ 'ui_locales': culture });
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  getUserInfo() {
    this.oidcSecurityService.getUserData().subscribe(
      userData => {
        this.userData = userData;
      });

    this.oidcSecurityService.getUserinfo().subscribe(
      userInfo => {
        this.userInfo = userInfo;
      });
  }

  getToken() {
    this.token = this.oidcSecurityService.getToken();
  }

  getTokenExpire() {
    this.oidcSecurityService.getIsAuthorized().subscribe(value => {
      const isAuthorized = value;
      this.tokenExpire = isAuthorized;
    });
  }

  private doCallbackLogicIfRequired() {
    if (window.location.hash) {
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
