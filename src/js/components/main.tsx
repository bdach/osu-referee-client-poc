import LoginCard from "./login";
import { Component } from "react";
import AppState, { UserCredentials } from "../models/AppState";
import RoomsView from "./rooms";

export default class Main extends Component<unknown, AppState>
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
                    },
                online: {state: 'not-logged-in'}
            }
        };
    }

    render() {
        if (this.state.user.online.state === 'logged-in')
        {
            return <RoomsView />
        }

        return (
            <div className='container'>
                <LoginCard
                    user={this.state.user}
                    onLogin={this.onLogin.bind(this)} />
            </div>
        )
    }

    private onLogin(credentials: UserCredentials)
    {
        this.setState({
            user: {
                credentials: credentials,
                online: {state: 'logging-in'}
            }
        });

        setTimeout(() => {
            this.setState(prevState => {
                return {
                    user: {
                        credentials: prevState.user.credentials,
                        online: {state: 'logged-in', clientToken: 'deadbeef'}
                    }
                }
            })
        }, 1000);
    }
}