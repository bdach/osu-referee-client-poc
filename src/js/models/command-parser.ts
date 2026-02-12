import RefereeClient from "./referee-client/main";
import {EventType, RoomEvent} from "./event";
import {Mod, MatchTeam, MatchType} from "./referee-client/common";

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

                const response = await this.client.makeRoom({
                    ruleset_id: rulesetId,
                    beatmap_id: beatmapId,
                    name: roomName
                });
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

            case "name":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to NAME.");

                if (split.length <= 1)
                    throw new Error("Syntax: NAME room_name")

                const name = split.slice(1).join(' ');
                await this.client.changeRoomSettings(currentRoomId, { name })
                break;
            }

            case "password":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to PASSWORD.");

                if (split.length <= 1)
                    throw new Error("Syntax: PASSWORD new_password")

                const password = split.slice(1).join(' ');
                await this.client.changeRoomSettings(currentRoomId, { password })
                break;
            }

            case "set":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to SET.");

                let type: MatchType;

                try {
                    type = split[1] as MatchType;
                } catch (e) {
                    throw new Error("Syntax: SET (head_to_head|team_versus)");
                }

                await this.client.changeRoomSettings(currentRoomId, { type })
                break;
            }

            case "map":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to MAP.");

                let beatmapId: number;
                let rulesetId: number | undefined = undefined;

                try {
                    if (split.length === 3)
                        rulesetId = Number.parseInt(split[1]);
                    beatmapId = Number.parseInt(split[split.length - 1]);
                } catch (e) {
                    throw new Error("Syntax: MAP [ruleset_id] beatmap_id");
                }

                await this.client.editCurrentPlaylistItem(currentRoomId, { ruleset_id: rulesetId, beatmap_id: beatmapId });
                break;
            }

            case "mods":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to MODS.");

                let mods: Mod[];

                try {
                    mods = JSON.parse(split.slice(1).join(' ')) as Mod[];
                } catch (e) {
                    throw new Error("Syntax: MODS mods_as_json");
                }
                await this.client.editCurrentPlaylistItem(currentRoomId, { required_mods: mods });
                break;
            }

            case "freemods":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to FREEMODS.");

                let mods: Mod[];

                try {
                    mods = JSON.parse(split.slice(1).join(' ')) as Mod[];
                } catch (e) {
                    throw new Error("Syntax: FREEMODS mods_as_json");
                }

                await this.client.editCurrentPlaylistItem(currentRoomId, { allowed_mods: mods });
                break;
            }

            case "team":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to TEAM.");

                let userId: number;
                let team: MatchTeam;

                try {
                    userId = Number.parseInt(split[1]);
                    team = split[2] as MatchTeam;
                } catch (e) {
                    throw new Error("Syntax: TEAM user_id (blue|red)");
                }

                await this.client.moveUser(currentRoomId, { user_id: userId, team })
                break;
            }

            case "start":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to START.");

                let seconds: number | undefined = undefined;

                try {
                    if (split.length > 1)
                        seconds = Number.parseInt(split[1]);
                } catch (e) {
                    throw new Error("Syntax: START [seconds]");
                }

                await this.client.startMatch(currentRoomId, { countdown: seconds })
                break;
            }

            case "abort":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to ABORT.");

                await this.client.abortMatch(currentRoomId);
                break;
            }

            case "aborttimer":
            {
                if (currentRoomId == null)
                    throw new Error("Must be in a room to ABORTTIMER.");

                await this.client.stopMatchCountdown(currentRoomId);
                break;
            }

            default:
                throw new Error(`Unsupported command: ${command}`);
        }
    }
}