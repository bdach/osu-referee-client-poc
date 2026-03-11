import {Component, useEffect, useRef} from "react";
import Room from "../models/room";
import RefereeClient from "../models/referee-client/main";
import CommandParser from "../models/command-parser";
import {Event, EventType, HasEvents, RoomJoinedEvent} from "../models/event";
import RenderedEvent from "./events";
import {RoomJoinedResponse} from "../models/referee-client/responses";

interface RoomState
{
    rooms: Room[];
    activeEventStream: HasEvents;
    currentCommand: string;
}

export interface Props {
    client: RefereeClient;
    onLogout: () => Promise<void>;
}

const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

export default class RoomsView extends Component<Props, RoomState>
{
    private parser: CommandParser;

    constructor(props: Props) {
        super(props);
        this.parser = new CommandParser(props.client);
        this.state = {
            rooms:
            [
            ],
            activeEventStream: { events: [] },
            currentCommand: '',
        };

        props.client.onPong(msg => this.postEvent(this.state.activeEventStream, { event_type: EventType.SystemMessage, message: msg }));

        // there is probably a much better way to do this, but I don't know it.
        // I tried generics briefly and they didn't work. so whatever.
        // my primary goal here is not to be a type wizard (though it would be nice if I were one).
        props.client.onUserJoined(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserJoined, ...msg }
        ));
        props.client.onUserLeft(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserLeft, ...msg }
        ));
        props.client.onUserKicked(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserKicked, ...msg }
        ));
        props.client.onUserBanned(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserBanned, ...msg }
        ));
        props.client.onRefereeAdded(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.RefereeAdded, ...msg }
        ));
        props.client.onRefereeInvited(msg => this.postEvent(
            this.state.activeEventStream,
            { event_type: EventType.RefereeInvited, ...msg }
        ));
        props.client.onRefereeRemoved(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.RefereeRemoved, ...msg }
        ));
        props.client.onRoomSettingsChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.RoomSettingsChanged, ...msg }
        ));
        props.client.onMatchStateChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.MatchStateChanged, ...msg }
        ));
        props.client.onPlaylistItemAdded(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.PlaylistItemAdded, ...msg }
        ));
        props.client.onPlaylistItemChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.PlaylistItemChanged, ...msg }
        ));
        props.client.onPlaylistItemRemoved(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.PlaylistItemRemoved, ...msg }
        ));
        props.client.onUserStatusChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserStatusChanged, ...msg }
        ));
        props.client.onUserModsChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserModsChanged, ...msg }
        ));
        props.client.onUserStyleChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserStyleChanged, ...msg }
        ));
        props.client.onUserTeamChanged(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.UserTeamChanged, ...msg }
        ));
        props.client.onCountdownStarted(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.CountdownStarted, ...msg }
        ));
        props.client.onCountdownStopped(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.CountdownStopped, ...msg }
        ));
        props.client.onMatchStarted(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.MatchStarted, ...msg }
        ));
        props.client.onMatchAborted(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.MatchAborted, ...msg }
        ));
        props.client.onMatchCompleted(msg => this.postEvent(
            this.state.rooms.find(room => room.id === msg.room_id),
            { event_type: EventType.MatchCompleted, ...msg }
        ));
    }


    render() {
        return (
            <div className='container-fluid vh-100 d-flex flex-column'>
                <div className='row pt-2 pb-2 mx-0'>
                    <ul className='nav nav-tabs'>
                        {this.state.rooms.map((room: Room) => (
                            <li key={room.id} className='nav-item'>
                                <a className={`nav-link ${room === this.state.activeEventStream ? 'active' : ''}`}
                                   href='#'
                                   onClick={this.activateRoom.bind(this, room)}>{room.name}</a>
                            </li>
                        ))}
                        <div className='flex-fill' />
                        <button type='button' className='btn btn-sm btn-danger align-self-center my-1' onClick={this.props.onLogout}>Log out</button>
                    </ul>
                </div>
                <div className='row mx-0 flex-grow-1 flex-shrink-1 overflow-y-auto'>
                    <ul className='list-group mx-0 px-0'>
                        {this.state.activeEventStream?.events.map(ev =>
                            <RenderedEvent
                                event={ev}
                                closeTab={this.closeCurrentStream.bind(this)}
                                joinRoom={this.joinRoom.bind(this)} />
                        )}
                    </ul>
                    <AlwaysScrollToBottom />
                </div>
                <div className='row mx-0 mt-2 mb-3'>
                    <div className='input-group px-0'>
                        <input type='text'
                               className='form-control'
                               placeholder={this.getPlaceholderText(this.state.activeEventStream)}
                               value={this.state.currentCommand}
                               onChange={e => this.updateCommand(e.target.value)}
                               onKeyDown={async e => {
                                   if (e.key === 'Enter') {
                                       await this.submitCurrentCommand();
                                       e.preventDefault();
                                   }
                               }}
                        />
                        <button className='btn btn-primary'
                                type='button'>Send</button>
                    </div>
                </div>
            </div>
        )
    }

    private getPlaceholderText(stream: HasEvents | Room) {
        if ("name" in stream) {
            return `Refereeing in room "${stream.name}".`;
        } else {
            return "`MAKE ruleset_id beatmap_id room_name` to create a room.";
        }
    }

    private activateRoom(room: Room)
    {
        this.setState(prevState => {
            return {
                ...prevState,
                activeEventStream: room
            }
        })
    }

    private updateCommand(command: string)
    {
        this.setState(prevState => {
            return {
                ...prevState,
                currentCommand: command
            }
        });
    }

    private async submitCurrentCommand()
    {
        try {
            const result = await this.parser.execute((this.state.activeEventStream as Room).id, this.state.currentCommand);
            if (result != null) {
                if (result.event_type === EventType.RoomJoined)
                {
                    this.onRoomJoined(result)
                    return;
                }

                this.postEvent(this.state.rooms.find(room => room.id === result.room_id), result);
            }
        } catch (error) {
            this.postEvent(this.state.activeEventStream, {
                event_type: EventType.Error,
                message: error.toString()
            });
        }

        this.setState(prevState => {
            return {
                ...prevState,
                currentCommand: ''
            }
        });
    }

    private postEvent(stream: HasEvents, event: Event)
    {
        const newEvents = [...stream.events, event];
        const newStream = {
            ...stream,
            events: newEvents
        };

        const newRoom = newStream as Room;

        this.setState(prevState => {
            return {
                ...prevState,
                rooms: prevState.rooms.map(room => room.id === newRoom?.id ? newRoom : room),
                activeEventStream: prevState.activeEventStream === stream ? newStream : prevState.activeEventStream,
            }
        });
    }

    private closeCurrentStream()
    {
        const stream = this.state.activeEventStream;
        if ("id" in stream) {
            const closedRoom = stream as Room;
            const newRooms = this.state.rooms.filter(room => room.id !== closedRoom.id);
            const nextActiveEventStream: HasEvents = newRooms.length > 0 ? newRooms[0] : {events: []};

            this.setState(prevState => {
                return {
                    ...prevState,
                    rooms: newRooms,
                    activeEventStream: nextActiveEventStream
                }
            })
        }
    }

    private async joinRoom(roomId: number) {
        const response = await this.props.client.joinRoom(roomId);
        const event = { event_type: EventType.RoomJoined, ...response};
        this.onRoomJoined(event as { event_type: EventType.RoomJoined } & RoomJoinedResponse);
    }

    private onRoomJoined(event: RoomJoinedEvent) {
        const newRoom: Room = { id: event.room_id, name: event.name, events: [event] };
        this.setState(prevState => {
            return {
                ...prevState,
                rooms: prevState.rooms.concat([newRoom]),
                activeEventStream: newRoom,
                currentCommand: ''
            }
        })
    }
}