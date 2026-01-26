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
}

export type OnlineState =
| { state: 'not-logged-in', lastError?: string }
| { state: 'logging-in' }
| { state: 'logged-in', clientToken: string }