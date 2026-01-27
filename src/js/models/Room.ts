import { HasEvents } from "./Event";

export default interface Room extends HasEvents
{
    id: number;
    name: string;
}