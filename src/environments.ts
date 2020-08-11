export const environment = {
  production: false,
  Auth: {
    hostedUiUrl: 'CHANGE_ME',
    clientId: 'CHANGE_ME',
    response_type: 'code',
    scope: 'email+openid+profile',
    redirect_uri: 'CHANGE_ME',
    redirect_logout_uri: 'CHANGE_ME',
    identityProvider: 'COGNITO',

    srpFlow: {
      cognitoIdpUrl: 'https://cognito-idp.{region}.amazonaws.com/',
      region: 'CHANGE_ME',
      userPoolId: 'CHANGE_ME'
    }
  }
};
