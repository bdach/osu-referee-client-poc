import LoginCard from "./login";
import {Component} from "react";
import AppState, {GrantType, UserCredentials} from "../models/AppState";
import RoomsView from "./rooms";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import RefereeClient from "../models/RefereeClient";

export interface Props
{
    osuWebUrl: string;
    refereeHubUrl: string;
}

export default class Main extends Component<Props, AppState>
{
    constructor(props: never) {
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
            formData.append('client_id', this.state.user.credentials.clientId);
            formData.append('client_secret', this.state.user.credentials.clientSecret);
            formData.append('grant_type', this.state.user.credentials.grantType);
            const response = await fetch(
                `${this.props.osuWebUrl}/oauth/token`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

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
            .withUrl(this.props.refereeHubUrl, {
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