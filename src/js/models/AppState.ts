import RefereeClient from "./RefereeClient";

export default interface AppState
{
    user: UserState;
}

export interface UserState
{
    credentials: UserCredentials;
    online: OnlineState;
}

export interface UserCredentials
{
    clientId: string | null;
    clientSecret: string | null;
    grantType: GrantType;
}

export enum GrantType
{
    ClientCredentials = 'client_credentials',
    AuthorizationCode = 'authorization_code',
}

export type OnlineState =
| { state: 'not-logged-in', lastError?: string }
| { state: 'logging-in' }
| { state: 'logged-in', client: RefereeClient }