export interface InitiateLoginChallengeParameters {
  SALT: string;
  SECRET_BLOCK: string;
  SRP_B: string;
  USERNAME: string;
  USER_ID_FOR_SRP: string;
}
