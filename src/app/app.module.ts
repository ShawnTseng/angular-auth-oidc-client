import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  AuthModule,
  OidcConfigService,
  OidcSecurityService,
  AuthWellKnownEndpoints,
  OpenIDImplicitFlowConfiguration
} from 'angular-auth-oidc-client';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot()
  ],
  providers: [OidcConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService) {
    const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
    const stsServer = 'https://localhost:5001';
    const redirectUri = 'http://localhost:4200/landing';
    const clientId = 'ng-basicsite';
    const responseType = 'id_token token';
    const scope = 'openid UserDataApi userInfo';


    openIDImplicitFlowConfiguration.stsServer = stsServer;
    openIDImplicitFlowConfiguration.redirect_url = redirectUri;
    // The Client MUST validate that the aud (audience) Claim contains its client_id value registered
    // at the Issuer identified by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
    // or if it contains additional audiences not trusted by the Client.
    openIDImplicitFlowConfiguration.client_id = clientId;
    openIDImplicitFlowConfiguration.response_type = responseType;
    openIDImplicitFlowConfiguration.scope = scope;
    openIDImplicitFlowConfiguration.post_logout_redirect_uri = `${stsServer}/Unauthorized`;
    openIDImplicitFlowConfiguration.start_checksession = false;

    openIDImplicitFlowConfiguration.silent_renew = true;
    openIDImplicitFlowConfiguration.silent_renew_url = `${stsServer}/silent-renew.html`;
    openIDImplicitFlowConfiguration.post_login_route = '/dataeventrecords';
    // HTTP 403
    openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
    // HTTP 401
    openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';
    openIDImplicitFlowConfiguration.log_console_warning_active = true;
    openIDImplicitFlowConfiguration.log_console_debug_active = true;
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

    const authWellKnownEndpoints = new AuthWellKnownEndpoints();
    authWellKnownEndpoints.issuer = `${stsServer}`;

    authWellKnownEndpoints.jwks_uri = `${stsServer}/.well-known/openid-configuration/jwks`;
    authWellKnownEndpoints.authorization_endpoint = `${stsServer}/connect/authorize`;
    authWellKnownEndpoints.token_endpoint = `${stsServer}/connect/token`;
    authWellKnownEndpoints.userinfo_endpoint = `${stsServer}/connect/userinfo`;
    authWellKnownEndpoints.end_session_endpoint = `${stsServer}/connect/endsession`;
    authWellKnownEndpoints.check_session_iframe = `${stsServer}/connect/checksession`;
    authWellKnownEndpoints.revocation_endpoint = `${stsServer}/connect/revocation`;
    authWellKnownEndpoints.introspection_endpoint = `${stsServer}/connect/introspect`;

    this.oidcSecurityService.setupModule(
      openIDImplicitFlowConfiguration,
      authWellKnownEndpoints
    );
  }
}
