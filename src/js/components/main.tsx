import LoginCard from "./login";
import {Component} from "react";
import AppState, {GrantType, OnlineState, UserCredentials} from "../models/AppState";
import RoomsView from "./rooms";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import RefereeClient from "../models/RefereeClient";
import { OSU_WEB_URL, SPECTATOR_SERVER_URL } from "../../../config";

const LOCAL_STORAGE_CLIENT_ID_KEY = 'client_id';
const LOCAL_STORAGE_CLIENT_SECRET_KEY = 'client_secret'

export default class Main extends Component<unknown, AppState>
{
    constructor(props: unknown) {
        super(props);

        let online: OnlineState = { state: 'not-logged-in' };

        if (window.location.search) {
            const params = new URLSearchParams(window.location.search);

            if (params.get('code')) {
                online = { state: 'logging-in' };
                this.completeAuthCodeFlow(params.get('code'));
            } else if (params.get("error")) {
                online.lastError = params.get('hint');
            } else {
                online.lastError = 'Unknown error.'
            }
        }

        this.state =
        {
            user: {
                credentials:
                    {
                        clientId: '',
                        clientSecret: '',
                        grantType: GrantType.ClientCredentials
                    },
                online
            }
        };
    }

    render() {
        if (this.state.user.online.state === 'logged-in')
        {
            return <RoomsView
                client={this.state.user.online.client}
                onLogout={this.onLogout.bind(this)} />
        }

        return (
            <div className='container'>
                <LoginCard
                    user={this.state.user}
                    onLogin={this.onLoginRequested.bind(this)} />
            </div>
        )
    }

    private async onLoginRequested(credentials: UserCredentials)
    {
        this.setState({
            user: {
                credentials: credentials,
                online: {state: 'logging-in'}
            }
        });

        if (credentials.grantType === GrantType.ClientCredentials) {
            const formData = new FormData();
            formData.append('client_id', credentials.clientId);
            formData.append('client_secret', credentials.clientSecret);
            formData.append('grant_type', credentials.grantType);
            formData.append('scope', 'delegate multiplayer.write_manage chat.write')

            const refereeClient = await this.connectToRefereeHub(formData);

            if (!refereeClient) {
                return;
            } else {
                this.completeLogin(refereeClient);
            }
        } else if (credentials.grantType === GrantType.AuthorizationCode) {
            const redirectUrl = new URL("/oauth/authorize", OSU_WEB_URL);
            redirectUrl.searchParams.append('client_id', credentials.clientId);
            redirectUrl.searchParams.append('redirect_uri', document.URL.split('?')[0]);
            redirectUrl.searchParams.append('response_type', 'code');
            redirectUrl.searchParams.append('scope', 'multiplayer.write_manage chat.write');

            // store the credentials in local storage, because we will lose them after we redirect to perform
            // the auth code flow.
            // this is maybe not the best, but definitely much less stupid than trying to jam it into the `state`
            // of the auth code flow. I think so, at least...?
            window.localStorage.setItem(LOCAL_STORAGE_CLIENT_ID_KEY, credentials.clientId);
            window.localStorage.setItem(LOCAL_STORAGE_CLIENT_SECRET_KEY, credentials.clientSecret);

            window.location.href = redirectUrl.toString();
            return;
        } else {
            this.setLoginError('Not supported yet.')
        }
    }

    private async completeAuthCodeFlow(code: string) : Promise<RefereeClient | undefined>
    {
        const formData = new FormData();
        formData.append('client_id', window.localStorage.getItem(LOCAL_STORAGE_CLIENT_ID_KEY));
        formData.append('client_secret', window.localStorage.getItem(LOCAL_STORAGE_CLIENT_SECRET_KEY));
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('scope', 'multiplayer.write_manage chat.write')
        formData.append('redirect_uri', document.URL.split('?')[0]);

        const client = await this.connectToRefereeHub(formData);

        if (client) {
            this.completeLogin(client);
        }

        return client;
    }

    private async connectToRefereeHub(oAuthRequestArgs : FormData) : Promise<RefereeClient | undefined>
    {
        let response: Response;

        try {
            response = await fetch(
                new URL("/oauth/token", OSU_WEB_URL),
                {
                    method: 'POST',
                    body: oAuthRequestArgs,
                }
            );
        } catch (error) {
            this.setLoginError(`Failed to login: ${error}`);
            return;
        }

        if (!response.ok) {
            this.setLoginError('Incorrect credentials.');
            return;
        }

        const responseJson = await response.json();
        if (responseJson.access_token == null) {
            this.setLoginError('Incorrect credentials.');
            return;
        }

        const accessToken = responseJson.access_token;

        const connection = new HubConnectionBuilder()
            .withUrl(new URL('/referee', SPECTATOR_SERVER_URL).toString(), {
                accessTokenFactory: () => accessToken
            })
            .configureLogging(LogLevel.Information)
            .build();

        try {
            await connection.start()
            return new RefereeClient(connection);
        } catch (err) {
            this.setLoginError(`Error connecting to referee hub: ${err}`);
            return;
        }
    }

    private completeLogin(refereeClient : RefereeClient)
    {
        this.setState(prevState => {
            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    online: { state: 'logged-in', client: refereeClient }
                }
            }
        })
    }

    private setLoginError(error: string) {
        this.setState(prevState => {
            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    online: { state: 'not-logged-in', lastError: error }
                }
            }
        })
    }

    private async onLogout() {
        if (this.state.user.online.state === 'logged-in') {
            await this.state.user.online.client.disconnect();
        }

        this.setState(() => {
            return {
                user: {
                    credentials:
                        {
                            clientId: '',
                            clientSecret: '',
                            grantType: GrantType.ClientCredentials
                        },
                    online: { state: 'not-logged-in' }
                }
            }
        });
    }
}