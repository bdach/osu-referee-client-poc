import { Component } from "react";
import Room from "../models/Room";
import RefereeClient from "../models/RefereeClient";
import CommandParser from "../models/CommandParser";

interface RoomState
{
    rooms: Room[];
    activeEventStream: HasEvents;
    currentCommand: string;
}

interface HasEvents
{
    events: string[]
}

export interface Props {
    client: RefereeClient;
}

export default class RoomsView extends Component<Props, RoomState>
{
    private parser: CommandParser;

    constructor(props: Props) {
        super(props);
        this.parser = new CommandParser(props.client);
        this.state = {
            rooms:
            [
                { id: 1, name: 'Mock room', events: [] },
            ],
            activeEventStream: { events: [] },
            currentCommand: '',
        };

        props.client.onPong(msg => this.postEvent(this.state.activeEventStream, msg));
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
                    </ul>
                </div>
                <div className='row mx-0 flex-grow-1 flex-shrink-1 overflow-y-auto'>
                    <ul className='list-group mx-0 px-0'>
                        {this.state.activeEventStream?.events.map(ev => (
                            <li className='list-group-item'>{ev}</li>
                        ))}
                    </ul>
                </div>
                <div className='row mx-0 mt-2 mb-3'>
                    <div className='input-group px-0'>
                        <input type='text'
                               className='form-control'
                               placeholder={this.state.activeEventStream as Room ? `Refereeing in room "${(this.state.activeEventStream as Room).name}".` : "!mp create to create a room."}
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
            await this.parser.execute(this.state.currentCommand);
        } catch (error) {
            // TODO: style better
            this.postEvent(this.state.activeEventStream, `Error: ${error}`);
        }

        this.setState(prevState => {
            return {
                ...prevState,
                currentCommand: ''
            }
        });
    }

    private postEvent(stream: HasEvents, event: string)
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
                activeEventStream: prevState.activeEventStream === newStream ? newRoom : prevState.activeEventStream,
            }
        });
    }
}