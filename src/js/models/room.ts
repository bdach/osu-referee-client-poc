import { HasEvents } from "./event";

export default interface Room extends HasEvents
{
    id: number;
    name: string;
}