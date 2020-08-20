import { AuthCredentials } from './auth-credentials.model';

export interface AuthIdentityCredentials {
  Credentials: AuthCredentials;
  IdentityId: string;
}
