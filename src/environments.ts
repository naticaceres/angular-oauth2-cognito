export const environment = {
  Auth: {
    hostedUiUrl: 'CHANGE_ME',
    clientId: 'CHANGE_ME',
    response_type: 'code',
    scope: 'email+openid+profile',
    redirect_uri: 'https://angular-oauth2-cognito.stackblitz.io/login',
    redirect_logout_uri: 'https://angular-oauth2-cognito.stackblitz.io/logout',
    identityProvider: 'COGNITO'
  }
}