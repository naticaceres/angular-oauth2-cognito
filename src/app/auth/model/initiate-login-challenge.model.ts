import { InitiateLoginChallengeParameters } from './initiate-login-challenge-parameters.model';

export interface InitiateLoginChallenge {
  ChallengeName: string;
  ChallengeParameters: InitiateLoginChallengeParameters;
}
