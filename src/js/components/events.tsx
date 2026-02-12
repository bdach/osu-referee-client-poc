import * as Events from '../models/event';
import {OSU_WEB_URL} from "../../../config";
import {CountdownType, MatchTeam, Ruleset} from "../models/referee-client/common";

export interface Props
{
    closeTab: () => void;
}

export default function renderEvent(event: Events.Event, props: Props) {
    switch (event.event_type) {
        case Events.EventType.SystemMessage:
            return SystemMessage(event);

        case Events.EventType.Error:
            return Error(event);

        case Events.EventType.CountdownStarted:
            return CountdownStarted(event);

        case Events.EventType.CountdownStopped:
            return CountdownStopped(event);

        case Events.EventType.MatchAborted:
            return MatchAborted(event);

        case Events.EventType.MatchCompleted:
            return MatchCompleted(event);

        case Events.EventType.MatchStarted:
            return MatchStarted(event);

        case Events.EventType.PlaylistItemChanged:
            return PlaylistItemChanged(event);

        case Events.EventType.RoomDisbanded:
            return RoomDisbanded(props.closeTab);

        case Events.EventType.RoomJoined:
            return RoomJoined(event);

        case Events.EventType.RoomSettingsChanged:
            return RoomSettingsChanged(event);

        case Events.EventType.UserJoined:
            return UserJoined(event);

        case Events.EventType.UserLeft:
            return UserLeft(event);

        case Events.EventType.UserKicked:
            return UserKicked(event);

        case Events.EventType.UserModsChanged:
            return UserModsChanged(event);

        case Events.EventType.UserStatusChanged:
            return UserStatusChanged(event);

        case Events.EventType.UserStyleChanged:
            return UserStyleChanged(event);

        case Events.EventType.UserTeamChanged:
            return UserTeamChanged(event);
    }
}

export function SystemMessage(message: Events.SystemMessageEvent) {
    return (
        <li className='list-group-item d-flex align-items-center'>
            <span className='badge rounded-pill text-bg-dark me-2'>SYSTEM</span>
            {message.message}
        </li>
    );
}

export function Error(error: Events.ErrorEvent) {
    return (
        <li className='list-group-item list-group-item-danger'>{error.message}</li>
    );
}

export function CountdownStarted(event: Events.CountdownStartedEvent) {
    switch (event.type)
    {
        case CountdownType.MatchStart:
            return (
                <li className='list-group-item list-group-item-secondary'>Match will start in {event.seconds} seconds.</li>
            )

        case CountdownType.ServerShuttingDown:
            return (
                <li className='list-group-item list-group-item-warning'>The server will shut down in {event.seconds} seconds.</li>
            )
    }
}

export function CountdownStopped(event: Events.CountdownStoppedEvent) {
    switch (event.type)
    {
        case CountdownType.MatchStart:
            return (
                <li className='list-group-item list-group-item-warning'>Scheduled match start has been aborted.</li>
            )

        case CountdownType.ServerShuttingDown:
            return (
                <li className='list-group-item list-group-item-dark'>Server shutdown has been aborted.</li>
            )
    }
}

export function MatchAborted(event: Events.MatchAbortedEvent) {
    return (
        <li className='list-group-item list-group-item-danger'>The match has been aborted (playlistItem:{event.playlist_item_id}).</li>
    )
}

export function MatchCompleted(event: Events.MatchCompletedEvent) {
    return (
        <li className='list-group-item list-group-item-success'>The match has completed (playlistItem:{event.playlist_item_id}).</li>
    )
}

export function MatchStarted(event: Events.MatchStartedEvent) {
    return (
        <li className='list-group-item list-group-item-primary'>Starting match (playlistItem:{event.playlist_item_id}).</li>
    )
}

export function PlaylistItemChanged(event: Events.PlaylistItemChangedEvent) {
    if (event.expired) {
        return (
            <li className='list-group-item list-group-item-dark'>Playlist item {event.playlist_item_id} has expired.</li>
        )
    }

    return (
        <li className='list-group-item list-group-item-info'>
            Playlist item {event.playlist_item_id} changed.
            <ul>
                <li>Beatmap: <a href={`${OSU_WEB_URL}/b/${event.beatmap_id}`}>/b/{event.beatmap_id}</a></li>
                <li>Ruleset: {Ruleset[event.ruleset_id]}</li>
                <li>Required mods: {event.required_mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{m.settings.length > 0 ? '*' : ''}</span>))}</li>
                <li>Allowed mods: {event.allowed_mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{m.settings.length > 0 ? '*' : ''}</span>))}</li>
                <li>Freestyle: {event.freestyle ? 'enabled' : 'disabled'}</li>
            </ul>
        </li>
    )
}

export function RoomDisbanded(closeTab: () => void) {
    return (
        <li className='list-group-item list-group-item-dark'>
            The room has been disbanded.
            <a className="link-danger link-underline-danger float-end" onClick={closeTab}>Close tab</a>
        </li>
    );
}

export function RoomJoined(event: Events.RoomJoinedEvent) {
    return (
        <li className='list-group-item list-group-item-success'>Welcome to room {event.name} (ID: {event.room_id})</li>
    );
}

export function RoomSettingsChanged(event: Events.RoomSettingsChangedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Room settings changed.
            <ul>
                <li>Name: {event.name}</li>
                <li>Password: {event.password}</li>
                <li>Mode: {event.type.toString()}</li>
                <li>Playlist item: {event.playlist_item_id}</li>
            </ul>
        </li>
    )
}

export function UserJoined(event: Events.UserJoinedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Player ID:{event.user_id} has joined.</li>
    );
}

export function UserLeft(event: Events.UserLeftEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Player ID:{event.user_id} has left.</li>
    );
}

export function UserKicked(event: Events.UserKickedEvent) {
    return (
        <li className='list-group-item list-group-item-warning'>Player ID:{event.kicked_user_id} has been kicked by ID:{event.kicking_user_id}.</li>
    );
}

export function UserModsChanged(event: Events.UserModsChangedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Player ID:{event.user_id} changed user mods to
            {event.mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{m.settings.length > 0 ? '*' : ''}</span>))}
        </li>
    )
}

export function UserStatusChanged(event: Events.UserStatusChangedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Player ID:{event.user_id} is {event.status.toString()}.
        </li>
    )
}

export function UserStyleChanged(event: Events.UserStyleChangedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Player ID:{event.user_id} changed style to:
            <ul>
                <li>Beatmap: {event.beatmap_id ? (<a href={`${OSU_WEB_URL}/b/${event.beatmap_id}`}>/b/{event.beatmap_id}</a>) : 'default'}</li>
                <li>Ruleset: {event.ruleset_id ? Ruleset[event.ruleset_id] : 'default'}</li>
            </ul>
        </li>
    )
}

export function UserTeamChanged(event: Events.UserTeamChangedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Player ID:{event.user_id} changed team to&nbsp;
            {event.team === MatchTeam.Blue ? <span className='badge text-bg-primary'>Blue</span> : <span className='badge text-bg-danger'>Red</span>}
        </li>
    )
}