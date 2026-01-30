import {GrantType, UserCredentials, UserState} from "../models/AppState";
import {useId, useState} from "react";

interface Props
{
    user: UserState;
    onLogin?: (credentials: UserCredentials) => void;
}

export default function LoginCard(props: Props) {
    const [credentials, setCredentials] = useState<UserCredentials>(props.user.credentials);

    const clientId = useId();
    const clientSecret = useId();
    const grantType = useId();

    return (
        <div className='card position-absolute top-50 start-50 translate-middle' style={{'width': '20rem'}}>
            <div className='card-body'>
                <h5 className='card-title'>Log in with osu!</h5>
                <div className='mb-3'>
                    <label htmlFor={clientId} className='form-label'>Client ID</label>
                    <input type='number'
                           className='form-control'
                           id={clientId}
                           placeholder='1'
                           min={1}
                           value={credentials.clientId}
                           onChange={e => setCredentials({...credentials, clientId: e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor={clientSecret} className='form-label'>Client secret</label>
                    <input type='password'
                           className='form-control'
                           id={clientSecret}
                           placeholder='40-character alphanumeric string'
                           maxLength={40}
                           value={credentials.clientSecret}
                           onChange={e => setCredentials({...credentials, clientSecret: e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor={grantType} className='form-label'>Grant type</label>
                    <select className='form-select'
                            value={credentials.grantType}
                            onChange={e => setCredentials({...credentials, grantType: e.target.value as GrantType})}>
                        {Object.values(GrantType).map(grantType => (
                            <option key={grantType} value={grantType}>{grantType}</option>
                        ))}
                    </select>
                </div>
                {props.user.online.state === 'not-logged-in' && props.user.online.lastError && <div className='alert alert-danger'>{props.user.online.lastError}</div>}
                <div>
                    <button type='submit'
                            className='btn btn-primary'
                            disabled={props.user.online.state !== "not-logged-in"}
                            onClick={() => props.onLogin(credentials)}>
                        {props.user.online.state === 'logging-in' && <span className='spinner-border spinner-border-sm me-1' aria-hidden='true'></span>}
                        <span role='status'>{props.user.online.state === 'not-logged-in' ? 'Log in' : 'Logging in...'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}