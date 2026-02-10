import RefereeClient from "./referee-client/main";
import {EventType, RoomEvent} from "./event";

export default class CommandParser
{
    private client: RefereeClient;

    constructor(client: RefereeClient)
    {
        this.client = client;
    }

    async execute(currentRoomId: number | undefined, command: string) : Promise<undefined | RoomEvent>
    {
        const split = command.split(/\s+/);

        switch (split[0].toLowerCase()) {
            case "ping":
                await this.client.ping(split.slice(1).join(' '));
                break;

            case "make":
            {
                let rulesetId: number;
                let beatmapId: number;
                let roomName: string;

                try
                {
                    rulesetId = Number.parseInt(split[1]);
                    beatmapId = Number.parseInt(split[2]);
                    roomName = split.slice(3).join(' ');
                } catch (e) {
                    throw new Error("Syntax: MAKE ruleset_id beatmap_id room_name");
                }

                const response = await this.client.makeRoom(rulesetId, beatmapId, roomName);
                return { event_type: EventType.RoomJoined, ...response };
            }

            case "join":
            {
                let newRoomId: number;

                try
                {
                    newRoomId = Number.parseInt(split[1]);
                } catch (e) {
                    throw new Error("Syntax: JOIN room_id");
                }

                const response = await this.client.joinRoom(newRoomId);
                return { event_type: EventType.RoomJoined, ...response };
            }

            case "leave":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to LEAVE.");

                await this.client.leaveRoom(currentRoomId);
                break;
            }

            case "close":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to CLOSE.");

                await this.client.closeRoom(currentRoomId);
                return { event_type: EventType.RoomDisbanded, room_id: currentRoomId };
            }

            case "invite":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to INVITE.");

                let userId: number;

                try
                {
                    userId = Number.parseInt(split[1]);
                } catch (e) {
                    throw new Error("Syntax: INVITE user_id");
                }

                await this.client.invitePlayer(currentRoomId, userId);

                break;
            }

            case "kick":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to KICK.");

                let userId: number;

                try
                {
                    userId = Number.parseInt(split[1]);
                } catch (e) {
                    throw new Error("Syntax: KICK user_id");
                }

                await this.client.kickPlayer(currentRoomId, userId);

                break;
            }

            default:
                throw new Error(`Unsupported command: ${command}`);
        }
    }
}