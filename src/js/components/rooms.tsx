import { Component } from "react";
import Room from "../models/Room";

interface RoomState
{
    rooms: Room[];
    activeRoom?: Room;
    currentCommand: string;
}

export default class RoomsView extends Component<unknown, RoomState>
{
    constructor(props: unknown) {
        super(props);
        this.state = {
            rooms:
            [
                { id: 1, name: 'first', events: [] },
                { id: 2, name: 'second', events: ['thing 1', 'thing 2'] },
                { id: 3, name: 'third', events: ['thing 3'] },
            ],
            activeRoom: null,
            currentCommand: '',
        };
    }

    render() {
        return (
            <div className='container-fluid vh-100 d-flex flex-column'>
                <div className='row pt-2 pb-2 mx-0'>
                    <ul className='nav nav-tabs'>
                        {this.state.rooms.map((room: Room) => (
                            <li key={room.id} className='nav-item'>
                                <a className={`nav-link ${room === this.state.activeRoom ? 'active' : ''}`}
                                   href='#'
                                   onClick={this.activateRoom.bind(this, room)}>{room.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='row mx-0 flex-grow-1 flex-shrink-1 overflow-y-auto'>
                    <ul className='list-group mx-0 px-0'>
                        {this.state.activeRoom?.events.map(ev => (
                            <li className='list-group-item'>{ev}</li>
                        ))}
                    </ul>
                </div>
                <div className='row mx-0 mt-2 mb-3'>
                    <div className='input-group px-0'>
                        <input type='text'
                               className='form-control'
                               placeholder={this.state.activeRoom == null ? "`!mp create` to create a room." : `Refereeing in room "${this.state.activeRoom.name}".`}
                               value={this.state.currentCommand}
                               onChange={e => this.updateCommand(e.target.value)}
                               onKeyDown={e => {
                                   if (e.key === 'Enter') {
                                       this.submitCurrentCommand();
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
                activeRoom: room
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

    private submitCurrentCommand()
    {
        if (this.state.activeRoom == null)
        {
            this.setState(prevState => {
                return {
                    ...prevState,
                    currentCommand: ''
                }
            })
        }

        const newEvents = [...this.state.activeRoom.events, this.state.currentCommand];
        const newRoom = {
            ...this.state.activeRoom,
            events: newEvents
        };

        this.setState(prevState => {
            return {
                ...prevState,
                rooms: prevState.rooms.map(room => room.id === newRoom.id ? newRoom : room),
                activeRoom: newRoom,
                currentCommand: ''
            }
        });
    }
}