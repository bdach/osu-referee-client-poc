import LoginCard from "./login";
import {Component} from "react";
import AppState, {GrantType, UserCredentials} from "../models/AppState";
import RoomsView from "./rooms";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import RefereeClient from "../models/RefereeClient";
import { OSU_WEB_URL, SPECTATOR_SERVER_URL } from "../../../config";

export default class Main extends Component<unknown, AppState>
{
    constructor(props: unknown) {
        super(props);
        this.state =
        {
            user: {
                credentials:
                    {
                        clientId: '',
                        clientSecret: '',
                        grantType: GrantType.ClientCredentials
                    },
                online: {state: 'not-logged-in'}
            }
        };
    }

    render() {
        if (this.state.user.online.state === 'logged-in')
        {
            return <RoomsView client={this.state.user.online.client} />
        }

        return (
            <div className='container'>
                <LoginCard
                    user={this.state.user}
                    onLogin={this.onLogin.bind(this)} />
            </div>
        )
    }

    private async onLogin(credentials: UserCredentials)
    {
        this.setState({
            user: {
                credentials: credentials,
                online: {state: 'logging-in'}
            }
        });

        let accessToken: string;

        if (this.state.user.credentials.grantType === GrantType.ClientCredentials) {
            const formData = new FormData();
            formData.append('client_id', credentials.clientId);
            formData.append('client_secret', credentials.clientSecret);
            formData.append('grant_type', credentials.grantType);
            formData.append('scope', 'multiplayer.write_manage delegate')

            let response: Response;
            try
            {
                response = await fetch(
                    new URL("/oauth/token", OSU_WEB_URL),
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
            }
            catch (error)
            {
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

            accessToken = responseJson.access_token;
        } else {
            this.setLoginError('Not supported yet.')
        }

        const connection = new HubConnectionBuilder()
            .withUrl(new URL('/referee', SPECTATOR_SERVER_URL).toString(), {
                accessTokenFactory: () => accessToken
            })
            .configureLogging(LogLevel.Information)
            .build();

        try {
            await connection.start()
        } catch (err) {
            this.setLoginError(`Error connecting to referee hub: ${err}`);
            return;
        }

        const refereeClient = new RefereeClient(connection);
        this.setState(prevState => {
            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    online: {state: 'logged-in', client: refereeClient}
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
                    online: {state: 'not-logged-in', lastError: error}
                }
            }
        })
    }
}