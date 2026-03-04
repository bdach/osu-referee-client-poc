import * as Events from '../models/event';
import {OSU_WEB_URL} from "../../../config";
import {CountdownType, MatchTeam, PlaylistItem, Player, Ruleset} from "../models/referee-client/common";

export interface Props
{
    event: Events.Event;
    closeTab: () => void;
    joinRoom: (roomId: number) => void;
}

export default function RenderedEvent(props: Props) {
    switch (props.event.event_type) {
        case Events.EventType.SystemMessage:
            return <SystemMessage {...props.event} />;

        case Events.EventType.Error:
            return Error(props.event);

        case Events.EventType.CountdownStarted:
            return CountdownStarted(props.event);

        case Events.EventType.CountdownStopped:
            return CountdownStopped(props.event);

        case Events.EventType.MatchAborted:
            return MatchAborted(props.event);

        case Events.EventType.MatchCompleted:
            return MatchCompleted(props.event);

        case Events.EventType.MatchStarted:
            return MatchStarted(props.event);

        case Events.EventType.PlaylistItemAdded:
            return PlaylistItemAdded(props.event);

        case Events.EventType.PlaylistItemChanged:
            return PlaylistItemChanged(props.event);

        case Events.EventType.PlaylistItemRemoved:
            return PlaylistItemRemoved(props.event);

        case Events.EventType.RefereeAdded:
            return RefereeAdded(props.event);

        case Events.EventType.RefereeInvited:
            return RefereeInvited(props.event, props.joinRoom);

        case Events.EventType.RefereeRemoved:
            return RefereeRemoved(props.event);

        case Events.EventType.RoomDisbanded:
            return RoomDisbanded(props.closeTab);

        case Events.EventType.RoomJoined:
            return <RoomJoined {...props.event} />;

        case Events.EventType.RoomSettingsChanged:
            return RoomSettingsChanged(props.event);

        case Events.EventType.UserJoined:
            return UserJoined(props.event);

        case Events.EventType.UserLeft:
            return UserLeft(props.event);

        case Events.EventType.UserKicked:
            return UserKicked(props.event);

        case Events.EventType.UserModsChanged:
            return UserModsChanged(props.event);

        case Events.EventType.UserStatusChanged:
            return UserStatusChanged(props.event);

        case Events.EventType.UserStyleChanged:
            return UserStyleChanged(props.event);

        case Events.EventType.UserTeamChanged:
            return UserTeamChanged(props.event);
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

export function PlaylistItemRender(props: {item: PlaylistItem})
{
    return (
        <ul>
            <li>Beatmap: <a href={`${OSU_WEB_URL}/b/${props.item.beatmap_id}`}>/b/{props.item.beatmap_id}</a></li>
            <li>Ruleset: {Ruleset[props.item.ruleset_id]}</li>
            <li>Required mods: {props.item.required_mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{Object.keys(m.settings).length > 0 ? '*' : ''}</span>))}</li>
            <li>Allowed mods: {props.item.allowed_mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{Object.keys(m.settings).length > 0 ? '*' : ''}</span>))}</li>
            <li>Freestyle: {props.item.freestyle ? 'enabled' : 'disabled'}</li>
            <li>Order: {props.item.order}</li>
        </ul>
    )
}

export function PlaylistItemAdded(event: Events.PlaylistItemAddedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Playlist item {event.playlist_item.id} added.
            <PlaylistItemRender item={event.playlist_item} />
        </li>
    )
}

export function PlaylistItemChanged(event: Events.PlaylistItemChangedEvent) {
    if (event.playlist_item.was_played) {
        return (
            <li className='list-group-item list-group-item-dark'>Playlist item {event.playlist_item.id} has expired.</li>
        )
    }

    return (
        <li className='list-group-item list-group-item-info'>
            Playlist item {event.playlist_item.id} changed.
            <PlaylistItemRender item={event.playlist_item} />
        </li>
    )
}

export function PlaylistItemRemoved(event: Events.PlaylistItemRemovedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Playlist item {event.playlist_item_id} removed.</li>
    )
}

export function RefereeAdded(event: Events.RefereeAddedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Referee ID:{event.user_id} added to room.</li>
    )
}

export function RefereeInvited(event: Events.RefereeInvitedEvent, joinRoom: (roomId: number) => void) {
    return (
        <li className='list-group-item list-group-item-primary'>
            You have been invited to referee a room.
            <a className="link-primary link-underline-primary float-end" onClick={() => joinRoom(event.room_id)}>Join room</a>
        </li>
    );
}

export function RefereeRemoved(event: Events.RefereeRemovedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Referee ID:{event.user_id} removed from room.</li>
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

export function PlayerRender(props: {player: Player}) {
    return (
        <li>
            Player ID:{props.player.user_id}
            <ul>
                <li>Status: {props.player.status.toString()}</li>
                <li>
                    Style:
                    <ul>
                        <li>Beatmap: {props.player.style.beatmap_id ? (<a href={`${OSU_WEB_URL}/b/${props.player.style.beatmap_id}`}>/b/{props.player.style.beatmap_id}</a>) : 'default'}</li>
                        <li>Ruleset: {props.player.style.ruleset_id ? Ruleset[props.player.style.ruleset_id] : 'default'}</li>
                    </ul>
                </li>
                <li>
                    Mods:
                    {props.player.mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{Object.keys(m.settings).length > 0 ? '*' : ''}</span>))}
                </li>
                {props.player.team && (props.player.team === MatchTeam.Blue ? <span className='badge text-bg-primary'>Blue</span> : <span className='badge text-bg-danger'>Red</span>)}
            </ul>
        </li>
    )
}

export function RoomJoined(event: Events.RoomJoinedEvent) {
    return (
        <li className='list-group-item list-group-item-success'>
            Welcome to room {event.name} (ID: {event.room_id})
            <ul>
                <li>Chat channel ID: {event.chat_channel_id}</li>
                <li>Mode: {event.type.toString()}</li>
                <li>
                    Playlist items:
                    <ol>
                        {event.playlist.map(item => (
                            <li key={item.id}>
                                Playlist item {item.id}
                                <PlaylistItemRender item={item} />
                            </li>
                        ))}
                    </ol>
                </li>
                <li>
                    Players:
                    <ul>
                        {event.players.map(player => <PlayerRender player={player} />)}
                    </ul>
                </li>
                <li>Referees: {event.referees.map(ref => ref.user_id).join(", ")}</li>
            </ul>
        </li>
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
    // TODO: the referee can get kicked themselves. the client should detect this somehow and inform the user more properly.
    return (
        <li className='list-group-item list-group-item-warning'>Player ID:{event.kicked_user_id} has been kicked by ID:{event.kicking_user_id}.</li>
    );
}

export function UserModsChanged(event: Events.UserModsChangedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>
            Player ID:{event.user_id} changed user mods to
            {event.mods.map(m => (<span className='badge text-bg-info'>{m.acronym}{Object.keys(m.settings).length > 0 ? '*' : ''}</span>))}
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